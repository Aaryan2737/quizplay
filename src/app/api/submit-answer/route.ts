import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { questions, Question } from '@/lib/questions';

export async function POST(request: Request) {
  try {
    const settingsRes = await pool.query(`SELECT is_quiz_active FROM settings WHERE id = 1`);
    if (settingsRes.rows.length > 0 && !settingsRes.rows[0].is_quiz_active) {
      return NextResponse.json({ error: 'Quiz is not active currently', inactive: true }, { status: 403 });
    }

    const cookieStore = await cookies();
    const participantId = cookieStore.get('participant_id')?.value;

    if (!participantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answerIndex, textResponse } = await request.json();

    // 1. Fetch user's current state and timing
    const userResult = await pool.query(
      `SELECT current_question_index, question_started_at, completed 
       FROM participants 
       WHERE id = $1`,
      [participantId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    if (user.completed) {
      return NextResponse.json({ error: 'Quiz already completed' }, { status: 400 });
    }

    const qIndex = user.current_question_index;
    
    if (qIndex >= questions.length) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 });
    }

    const currentQ = questions[qIndex];

    // 2. Calculate duration clamped to max 30s
    let durationSec = 30.0;
    if (user.question_started_at) {
      const startedAt = new Date(user.question_started_at).getTime();
      const now = Date.now();
      const diffSec = (now - startedAt) / 1000.0;
      // If user submits before 30s, take exact time. If they exceed, it clamps to 30.0
      // We allow a tiny buffer (32s) for network latency before clamping to 30s
      if (diffSec < 32.0) {
        durationSec = Math.min(diffSec, 30.0);
      }
    }

    // 3. Process Answer
    let isCorrect = false;

    if (currentQ.type === 'mcq') {
      const mcq = currentQ as Question;
      if (answerIndex === mcq.correctAnswerIndex) {
        isCorrect = true;
      }
      
      // Update DB
      await pool.query(
        `UPDATE participants 
         SET score = score + $1,
             total_time_spent = total_time_spent + $2,
             current_question_index = current_question_index + 1
         WHERE id = $3`,
        [isCorrect ? 1 : 0, durationSec, participantId]
      );

      return NextResponse.json({
        success: true,
        correct: isCorrect,
        correctAnswerIndex: mcq.correctAnswerIndex, // send back for immediate UI feedback
        nextIndex: qIndex + 1
      });

    } else if (currentQ.type === 'text') {
      
      // Ensure text is min 20 chars, otherwise we can reject or just accept if time ran out
      // Assuming auto-submit happens on 0, it might be empty.
      const responseText = (textResponse || '').toString().trim();
      
      await pool.query(
        `UPDATE participants 
         SET q10_response = $1,
             total_time_spent = total_time_spent + $2,
             current_question_index = current_question_index + 1,
             completed = true
         WHERE id = $3`,
        [responseText, durationSec, participantId]
      );

      return NextResponse.json({
        success: true,
        completed: true
      });
    }

  } catch (error: any) {
    console.error('Submit Answer Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

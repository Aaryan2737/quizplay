import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { getClientQuestion as getSanitizedQuestion, questions } from '@/lib/questions';

export async function GET() {
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

    // Fetch user and update question_started_at
    const result = await pool.query(
      `UPDATE participants 
       SET question_started_at = NOW() 
       WHERE id = $1 AND completed = false
       RETURNING current_question_index;`,
      [participantId]
    );

    if (result.rows.length === 0) {
      // User might be completed or doesn't exist
      const checkCompleted = await pool.query(
        `SELECT completed FROM participants WHERE id = $1`,
        [participantId]
      );
      if (checkCompleted.rows.length > 0 && checkCompleted.rows[0].completed) {
         return NextResponse.json({ completed: true });
      }
      return NextResponse.json({ error: 'Participant not found or invalid state' }, { status: 404 });
    }

    const { current_question_index } = result.rows[0];

    if (current_question_index >= questions.length) {
      // Mark as completed just in case
      await pool.query(`UPDATE participants SET completed = true WHERE id = $1`, [participantId]);
      return NextResponse.json({ completed: true });
    }

    const question = getSanitizedQuestion(current_question_index);

    return NextResponse.json({
      question,
      current_question_index,
      total_questions: questions.length
    });

  } catch (error: any) {
    console.error('Get Question Error:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

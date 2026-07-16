import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { questions } from '@/lib/questions';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const participantId = cookieStore.get('participant_id')?.value;

    if (!participantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { answerIndex, textResponse } = body;

    const { data: user, error: userError } = await supabase
      .from('participants')
      .select('current_question_index, question_started_at, completed, score, total_time_spent')
      .eq('id', participantId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    if (user.completed) {
      return NextResponse.json({ error: 'Quiz already completed' }, { status: 400 });
    }

    const qIndex = user.current_question_index;
    if (qIndex >= 10) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 });
    }

    const question = questions[qIndex];
    const maxTime = question.type === 'text' ? 60 : 30;

    // Clamp duration to max time plus small grace period (e.g. 2s)
    let duration = (Date.now() - new Date(user.question_started_at).getTime()) / 1000;
    if (isNaN(duration) || duration < 0) duration = 0;
    if (duration > maxTime + 2) duration = maxTime; // Clamped to max if exceeded
    
    if (question.type === 'mcq') {
      const isCorrect = answerIndex === question.correctAnswerIndex;
      const scoreIncrement = isCorrect ? 1 : 0;
      
      const { error: updateError } = await supabase
        .from('participants')
        .update({
          score: user.score + scoreIncrement,
          total_time_spent: user.total_time_spent + duration,
          current_question_index: user.current_question_index + 1
        })
        .eq('id', participantId);
        
      if (updateError) throw updateError;
      
      return NextResponse.json({
        success: true,
        correct: isCorrect,
        correctAnswerIndex: question.correctAnswerIndex,
        nextIndex: qIndex + 1
      });
    } else {
      // Q10 Text question
      const response = textResponse || '';
      
      const { error: updateError } = await supabase
        .from('participants')
        .update({
          q10_response: response,
          total_time_spent: user.total_time_spent + duration,
          completed: true,
          current_question_index: user.current_question_index + 1
        })
        .eq('id', participantId);
        
      if (updateError) throw updateError;
      
      return NextResponse.json({
        success: true,
        completed: true
      });
    }

  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

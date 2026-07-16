import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { getClientQuestion } from '@/lib/questions';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const participantId = cookieStore.get('participant_id')?.value;

    if (!participantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabase
      .from('participants')
      .select('current_question_index, completed')
      .eq('id', participantId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    if (user.completed || user.current_question_index >= 10) {
      return NextResponse.json({ completed: true });
    }

    // Update question_started_at to NOW()
    await supabase
      .from('participants')
      .update({ question_started_at: new Date().toISOString() })
      .eq('id', participantId);

    const question = getClientQuestion(user.current_question_index);

    return NextResponse.json({
      success: true,
      question,
      current_question_index: user.current_question_index,
    });
  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    const { data: participant, error } = await supabase
      .from('participants')
      .upsert({ username: cleanUsername }, { onConflict: 'username' })
      .select('id, current_question_index, completed')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('participant_id', participant.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        current_question_index: participant.current_question_index,
        completed: participant.completed,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

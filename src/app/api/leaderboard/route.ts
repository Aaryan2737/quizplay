import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: leaderboard, error } = await supabase
      .from('participants')
      .select('id, username, score, total_time_spent')
      .eq('completed', true)
      .order('score', { ascending: false })
      .order('total_time_spent', { ascending: true })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard || []
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

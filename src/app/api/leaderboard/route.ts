import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Ensure it doesn't cache statically if called repeatedly, 
// but Next.js might cache fetch. We use dynamic rendering here.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsRes = await pool.query(`SELECT show_leaderboard FROM settings WHERE id = 1`);
    if (settingsRes.rows.length > 0 && !settingsRes.rows[0].show_leaderboard) {
      return NextResponse.json({ hidden: true, leaderboard: [] });
    }

    const result = await pool.query(
      `SELECT username, score, total_time_spent, completed 
       FROM participants 
       ORDER BY score DESC, total_time_spent ASC 
       LIMIT 10;`
    );

    return NextResponse.json({
      leaderboard: result.rows
    });
  } catch (error: any) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

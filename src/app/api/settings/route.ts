import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`SELECT * FROM settings WHERE id = 1`);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, settings: result.rows[0] });
  } catch (error) {
    console.error('Settings Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { password, is_quiz_active, show_leaderboard } = await request.json();
    
    // Simple admin password check
    if (password !== 'ieee-admin-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `UPDATE settings 
       SET is_quiz_active = COALESCE($1, is_quiz_active), 
           show_leaderboard = COALESCE($2, show_leaderboard) 
       WHERE id = 1 
       RETURNING *`,
      [is_quiz_active, show_leaderboard]
    );

    return NextResponse.json({ success: true, settings: result.rows[0] });
  } catch (error) {
    console.error('Update Settings Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

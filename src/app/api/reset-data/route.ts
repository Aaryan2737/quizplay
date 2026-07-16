import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    // Simple password protection to prevent accidental or malicious resets
    if (password !== 'ieee-admin-2026') {
      return NextResponse.json({ error: 'Unauthorized: Invalid password' }, { status: 401 });
    }

    // Delete all records in the participants table
    const { error } = await supabase
      .from('participants')
      .delete()
      .neq('username', 'impossible_username_to_bypass_supabase_safety');

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'All data deleted successfully' });
  } catch (error) {
    console.error('Reset data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const { supabase, supabaseResponse } = createClient(req);

  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return supabaseResponse;
}

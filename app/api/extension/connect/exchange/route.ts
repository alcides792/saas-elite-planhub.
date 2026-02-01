import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// ADMIN CLIENT (Needed to fetch code without being logged in)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400, headers: corsHeaders });
    }

    // 1. Search code in DB
    const { data: codeRecord, error: codeError } = await supabaseAdmin
      .from('connect_codes')
      .select('user_id, expires_at')
      .eq('code', code)
      .single();

    if (codeError || !codeRecord) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401, headers: corsHeaders });
    }

    // 2. Check if expired (5-minute validity, for example)
    if (new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 401, headers: corsHeaders });
    }

    // 3. Generate a Permanent Token for the extension
    // (Can be a JWT or a secure random string)
    const extensionToken = 'ext_' + crypto.randomBytes(24).toString('hex');

    // 4. Save this token to user profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ extension_token: extensionToken }) // Ensure this column exists in 'profiles'
      .eq('id', codeRecord.user_id);

    if (updateError) throw updateError;

    // 5. Delete used code (prevent reuse)
    await supabaseAdmin.from('connect_codes').delete().eq('code', code);

    // 6. Return success exactly as the extension expects
    return NextResponse.json({
      ok: true,
      data: {
        extension_token: extensionToken,
        user: { email: 'Connected' } // Optional extra data
      }
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
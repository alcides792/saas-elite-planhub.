import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'No token' }, { status: 401, headers: corsHeaders });

    const token = authHeader.replace('Bearer ', '');

    // 1. Busca o ID do usuário usando o token (na tabela profiles)
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id') // Só precisamos do ID
      .eq('extension_token', token)
      .single();

    if (error || !profile) {
      return NextResponse.json({ ok: false, error: 'token_expired' }, { status: 401, headers: corsHeaders });
    }

    // 2. Busca o EMAIL REAL na tabela do sistema (auth.users)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.getUserById(profile.id);

    const email = user?.email || 'Email Oculto';

    // 3. Retorna tudo
    return NextResponse.json({
      ok: true,
      data: {
        email: email, 
        is_premium: true,
        limit: 9999,
        subs_count: 0,
        can_add: true
      }
    }, { headers: corsHeaders });

  } catch (err: any) {
    console.error("Erro /me:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
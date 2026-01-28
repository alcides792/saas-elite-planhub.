import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// CLIENTE ADMIN (Necessário para buscar o código sem estar logado)
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

    // 1. Procura o código no banco
    const { data: codeRecord, error: codeError } = await supabaseAdmin
      .from('connect_codes')
      .select('user_id, expires_at')
      .eq('code', code)
      .single();

    if (codeError || !codeRecord) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401, headers: corsHeaders });
    }

    // 2. Verifica se expirou (validade de 5 minutos, por exemplo)
    if (new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 401, headers: corsHeaders });
    }

    // 3. Gera um Token Permanente para a extensão
    // (Pode ser um JWT ou uma string aleatória segura)
    const extensionToken = 'ext_' + crypto.randomBytes(24).toString('hex');

    // 4. Salva esse token no perfil do usuário
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ extension_token: extensionToken }) // Certifique-se que essa coluna existe em 'profiles'
      .eq('id', codeRecord.user_id);

    if (updateError) throw updateError;

    // 5. Apaga o código usado (para não usar de novo)
    await supabaseAdmin.from('connect_codes').delete().eq('code', code);

    // 6. Retorna o sucesso exatamente como a extensão espera
    return NextResponse.json({
      ok: true,
      data: {
        extension_token: extensionToken,
        user: { email: 'Connected' } // Dados extras opcionais
      }
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
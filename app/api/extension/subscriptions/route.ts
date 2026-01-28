import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa cliente Admin
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
  console.log("💾 [API /subscriptions] Iniciando salvamento...");

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("❌ [API] Sem token");
      return NextResponse.json({ error: 'No token' }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await req.json();

    console.log("📦 Payload recebido:", body);

    // 1. Identificar Usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('extension_token', token)
      .single();

    if (profileError || !profile) {
      console.error("❌ [API] Perfil não encontrado ou erro:", profileError);
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // --- CORREÇÃO DE DATA ---
    // Se a data vier vazia string "", transforma em null, senão o banco recusa
    const renewalDate = body.renewal_date ? body.renewal_date : null;

    // 2. Salvar Assinatura
    const { error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: profile.id,
        name: body.service_name,
        amount: body.amount,
        currency: body.currency,
        billing_type: body.billing_cycle, // Verifica se sua coluna chama 'billing_type' ou 'billing_cycle'
        renewal_date: renewalDate,        // <--- AQUI ESTAVA O ERRO COMUM
        category: body.category,
        website: body.website,
        status: 'active',
       
      });

    if (insertError) {
      console.error("❌ [API] Erro do Supabase ao inserir:", insertError);
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500, headers: corsHeaders });
    }

    console.log("✅ [API] Sucesso absoluto!");
    return NextResponse.json({ ok: true, data: { success: true } }, { headers: corsHeaders });

  } catch (err: any) {
    console.error("❌ [API] Erro Fatal Catch:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireProPlan } from '@/utils/gatekeeper';

export async function POST(req: Request) {
  // CORREÇÃO: Adicionado 'await' aqui. No Next.js 15, cookies() é assíncrono.
  const cookieStore = await cookies();

  // 1. Cliente Padrão: Apenas para LER o cookie e saber quem é o usuário
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignora erro em Route Handlers
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignora erro em Route Handlers
          }
        },
      },
    }
  );

  // Verifica quem está logado
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 🔒 TRAVA DE SEGURANÇA
  const isPro = await requireProPlan();
  if (!isPro) {
    return NextResponse.json({ error: "Bloqueado: A conexão com a extensão é exclusiva para assinantes Pro." }, { status: 403 });
  }

  // 2. Cliente ADMIN: Para FORÇAR a gravação no banco (Ignora o erro RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const code = `PH-${randomPart}`;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // USAMOS O ADMIN AQUI PARA SALVAR
  const { error } = await supabaseAdmin
    .from('connect_codes')
    .insert({
      user_id: user.id,
      code: code,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    console.error("Erro ao salvar código:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code });
}
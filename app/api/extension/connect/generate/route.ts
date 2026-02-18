import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireProPlan } from '@/lib/utils/gatekeeper';

export async function POST(req: Request) {
  // CORRECTION: Added 'await' here. In Next.js 15, cookies() is asynchronous.
  const cookieStore = await cookies();

  // 1. Standard Client: Only to READ the cookie and know who the user is
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

  // Check who is logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 🔒 SECURITY GATE
  const isPro = await requireProPlan();
  if (!isPro) {
    return NextResponse.json({ error: "Blocked: Extension connection is exclusive for Pro subscribers." }, { status: 403 });
  }

  // 2. ADMIN Client: To FORCE writing to DB (Ignores RLS error)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const code = `PH-${randomPart}`;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // WE USE ADMIN HERE TO SAVE
  const { error } = await supabaseAdmin
    .from('connect_codes')
    .insert({
      user_id: user.id,
      code: code,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    console.error("Error saving code:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code });
}
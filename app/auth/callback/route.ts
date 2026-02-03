import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';

    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
    const origin = `${protocol}://${host}`;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Garantir que o redirecionamento use o domínio correto
            const redirectUrl = new URL(next, origin);
            return NextResponse.redirect(redirectUrl.toString());
        }

        console.error('Auth callback error:', error);
    }

    // Em caso de erro ou falta de código, redireciona para login com erro
    const loginUrl = new URL('/login?error=auth_callback_failed', origin);
    return NextResponse.redirect(loginUrl.toString());
}

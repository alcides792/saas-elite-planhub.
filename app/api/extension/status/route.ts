import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();

        // Standard client to identify the user
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
                            // Ignore in Route Handlers
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) {
                            // Ignore in Route Handlers
                        }
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ connected: false }, { status: 401 });
        }

        // Admin client to read the profile
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('extension_connected, last_extension_sync, extension_token')
            .eq('id', user.id)
            .single();

        if (error || !profile) {
            return NextResponse.json({ connected: false });
        }

        // If extension_token exists but extension_connected is false,
        // the user connected before this feature was deployed — auto-repair
        const isConnected = profile.extension_connected === true ||
            (profile.extension_token !== null && profile.extension_token !== '');

        if (isConnected && !profile.extension_connected) {
            // Auto-repair: set the flag for future polls
            await supabaseAdmin
                .from('profiles')
                .update({
                    extension_connected: true,
                    last_extension_sync: profile.last_extension_sync ?? new Date().toISOString(),
                })
                .eq('id', user.id);
        }

        return NextResponse.json({
            connected: isConnected,
            last_sync: profile.last_extension_sync ?? null,
        });
    } catch (err: any) {
        console.error('Extension status error:', err.message);
        return NextResponse.json({ connected: false }, { status: 500 });
    }
}

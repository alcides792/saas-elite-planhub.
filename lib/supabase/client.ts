import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

/**
 * Create a Supabase client for client-side operations (Client Components, browser)
 * This client uses browser cookies automatically
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('[Supabase Client v2-fresh] Missing environment variables:', {
            url: !!supabaseUrl,
            key: !!supabaseAnonKey
        });
    } else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        // Small debug log to help the user verify the URL is correct
        console.log('[Supabase Client v2-fresh] Initializing with URL:', supabaseUrl);
    }

    return createBrowserClient<Database>(
        supabaseUrl!,
        supabaseAnonKey!
    );
}

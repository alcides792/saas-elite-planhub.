import { createClient } from './supabase/server';

/**
 * Utility to verify if the user has an active Pro plan or trial.
 * Returns true if the user is Pro, false otherwise.
 */
export async function requireProPlan(): Promise<boolean> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('billing_status')
        .eq('id', user.id)
        .single();

    // Pro if status is 'active' or 'trialing'
    const isPro = profile?.billing_status === 'active' || profile?.billing_status === 'trialing';

    return isPro;
}

'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
    full_name: string;
}) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update or insert profile
        const { error } = await (supabase as any)
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: data.full_name,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/settings');
        return { success: true, error: null };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function getProfile() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { data: null, error: 'Unauthorized' };
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching profile:', error);
            return { data: null, error: error.message };
        }

        return { data: data || { id: user.id, full_name: null, plan: 'free' }, error: null };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { data: null, error: 'Failed to fetch profile' };
    }
}

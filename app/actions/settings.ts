'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get the current user's profile
 * Creates a default profile if it doesn't exist
 */
export async function getProfile(): Promise<{
    success: boolean;
    profile?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
        email: string;
        currency: string;
        language: string;
        extension_api_key: string | null;
        notify_emails: boolean;
        notify_summary: boolean;
        notify_days_before: number;
        telegram_chat_id: string | null;
        discord_webhook: string | null;
    };
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('[getProfile] Auth error:', authError);
            return {
                success: false,
                error: 'Authentication failed: ' + (authError.message || 'Unknown error'),
            };
        }

        if (!user) {
            console.warn('[getProfile] No user found');
            return {
                success: false,
                error: 'You must be authenticated.',
            };
        }

        // Get profile from database
        let { data: profile, error: profileError } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // If profile doesn't exist, create one
        if (profileError && (profileError as any).code === 'PGRST116') {
            const { data: newProfile, error: createError } = await (supabase as any)
                .from('profiles')
                .insert({
                    id: user.id,
                    full_name: user.user_metadata?.full_name || '',
                    avatar_url: user.user_metadata?.avatar_url || null,
                    currency: 'EUR',
                    language: 'en-US',
                    notify_emails: true,
                    notify_summary: true,
                    notify_days_before: 3
                })
                .select()
                .single();

            if (createError) {
                console.error('Error creating profile:', createError);
                return {
                    success: false,
                    error: 'Error creating default profile.',
                };
            }
            profile = newProfile;
        } else if (profileError) {
            console.error('Error fetching profile:', profileError);
            return {
                success: false,
                error: 'Error fetching profile.',
            };
        }

        if (!profile) {
            return {
                success: false,
                error: 'Profile not found.',
            };
        }

        return {
            success: true,
            profile: {
                id: profile.id,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                email: user.email || '',
                currency: profile.currency || 'EUR',
                language: profile.language || 'en-US',
                extension_api_key: profile.extension_api_key,
                notify_emails: profile.notify_emails ?? true,
                notify_summary: profile.notify_summary ?? true,
                notify_days_before: profile.notify_days_before ?? 3,
                telegram_chat_id: profile.telegram_chat_id || null,
                discord_webhook: profile.discord_webhook || null,
            },
        };
    } catch (error) {
        console.error('Unexpected error in getProfile:', error);
        return {
            success: false,
            error: 'Unexpected error.',
        };
    }
}

/**
 * Update user profile (name, currency, language, notifications)
 */
export async function updateProfile(data: {
    full_name: string;
    currency: string;
    language: string;
    notify_emails?: boolean;
    notify_summary?: boolean;
    notify_days_before?: number;
}): Promise<{
    success: boolean;
    error?: string;
    message?: string;
}> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'You must be authenticated.',
            };
        }

        // Update profile
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({
                full_name: data.full_name,
                currency: data.currency,
                language: data.language,
                notify_emails: data.notify_emails,
                notify_summary: data.notify_summary,
                notify_days_before: data.notify_days_before,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating profile:', updateError);
            return {
                success: false,
                error: 'Error updating profile.',
            };
        }

        // Revalidate pages that might display profile data
        revalidatePath('/settings');
        revalidatePath('/dashboard');

        return {
            success: true,
            message: 'Settings saved successfully!'
        };
    } catch (error) {
        console.error('Unexpected error in updateProfile:', error);
        return {
            success: false,
            error: 'Unexpected error.',
        };
    }
}

/**
 * Rotate the extension API Key
 */
export async function rotateApiKey(): Promise<{
    success: boolean;
    apiKey?: string;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'You must be authenticated.',
            };
        }

        // Generate a new secure key
        const newKey = 'elite_sk_' + crypto.randomUUID().replace(/-/g, '');

        // Update the user's profile with the new API key
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ extension_api_key: newKey })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error rotating API key:', updateError);
            return {
                success: false,
                error: 'Error generating new key.',
            };
        }

        // Revalidate
        revalidatePath('/settings');

        return {
            success: true,
            apiKey: newKey,
        };
    } catch (error) {
        console.error('Unexpected error in rotateApiKey:', error);
        return {
            success: false,
            error: 'Unexpected error.',
        };
    }
}

/**
 * Save alert preferences from Alerts page
 */
export async function saveAlertSettings(formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Unauthorized' };

        const settings = {
            notify_expiration: formData.get('notify_expiration') === 'on',
            notify_weekly_summary: formData.get('notify_weekly_summary') === 'on',
            notify_price_change: formData.get('notify_price_change') === 'on',
            notify_days_before: Number(formData.get('notify_days_before')),
            notify_time: String(formData.get('notify_time')),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('profiles')
            .update(settings)
            .eq('id', user.id);

        if (error) {
            console.error('Error saving alert settings:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/dashboard/alerts');
        return { success: true };
    } catch (error: any) {
        console.error('Unexpected error in saveAlertSettings:', error);
        return { success: false, error: error.message };
    }
}

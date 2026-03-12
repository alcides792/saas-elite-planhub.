'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireProPlan } from '@/lib/utils/gatekeeper';

/**
 * Generate or regenerate an API key for the authenticated user
 * This will replace any existing API key
 */
export async function generateApiKey(): Promise<{
    success: boolean;
    apiKey?: string;
    error?: string;
}> {
    try {
        // 🔒 TRAVA DE SEGURANÇA
        const isPro = await requireProPlan()
        if (!isPro) {
            return { success: false, error: "Blocked: You need a Pro plan to generate API keys." }
        }

        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'You must be authenticated to generate an API Key.',
            };
        }

        // Call the database function to generate a unique API key
        const { data: keyData, error: keyError } = await supabase.rpc(
            'generate_extension_api_key'
        );

        if (keyError) {
            console.error('Error generating API key:', keyError);
            return {
                success: false,
                error: 'Error generating key. Please try again.',
            };
        }

        const newApiKey = keyData as string;

        // Update the user's profile with the new API key
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ extension_api_key: newApiKey })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating profile with API key:', updateError);
            return {
                success: false,
                error: 'Error saving key. Please try again.',
            };
        }

        // Revalidate any pages that might display the API key
        revalidatePath('/settings');
        revalidatePath('/dashboard');

        return {
            success: true,
            apiKey: newApiKey,
        };
    } catch (error) {
        console.error('Unexpected error in generateApiKey:', error);
        return {
            success: false,
            error: 'Unexpected error. Please try again.',
        };
    }
}

/**
 * Get the current API key for the authenticated user
 */
export async function getApiKey(): Promise<{
    success: boolean;
    apiKey?: string | null;
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

        // Get the user's profile with API key
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('extension_api_key')
            .eq('id', user.id)
            .single() as { data: { extension_api_key: string | null } | null; error: any };

        if (profileError) {
            console.error('Error fetching API key:', profileError);
            return {
                success: false,
                error: 'Error fetching key.',
            };
        }

        return {
            success: true,
            apiKey: profile?.extension_api_key ?? null,
        };
    } catch (error) {
        console.error('Unexpected error in getApiKey:', error);
        return {
            success: false,
            error: 'Unexpected error.',
        };
    }
}

/**
 * Revoke (delete) the API key for the authenticated user
 */
export async function revokeApiKey(): Promise<{
    success: boolean;
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

        // Remove the API key from the user's profile
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ extension_api_key: null })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error revoking API key:', updateError);
            return {
                success: false,
                error: 'Error revoking key.',
            };
        }

        // Revalidate any pages that might display the API key
        revalidatePath('/settings');
        revalidatePath('/dashboard');

        return {
            success: true,
        };
    } catch (error) {
        console.error('Unexpected error in revokeApiKey:', error);
        return {
            success: false,
            error: 'Erro inesperado.',
        };
    }
}

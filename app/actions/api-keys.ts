'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireProPlan } from '@/utils/gatekeeper';

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
            return { success: false, error: "Bloqueado: Você precisa de um plano Pro para gerar chaves de API." }
        }

        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'Você precisa estar autenticado para gerar uma API Key.',
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
                error: 'Erro ao gerar a chave. Tente novamente.',
            };
        }

        const newApiKey = keyData as string;

        // Update the user's profile with the new API key
        // Type assertion needed because extension_api_key column is added via migration
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ extension_api_key: newApiKey })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating profile with API key:', updateError);
            return {
                success: false,
                error: 'Erro ao salvar a chave. Tente novamente.',
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
            error: 'Erro inesperado. Tente novamente.',
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
                error: 'Você precisa estar autenticado.',
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
                error: 'Erro ao buscar a chave.',
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
            error: 'Erro inesperado.',
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
                error: 'Você precisa estar autenticado.',
            };
        }

        // Remove the API key from the user's profile
        // Type assertion needed because extension_api_key column is added via migration
        const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ extension_api_key: null })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error revoking API key:', updateError);
            return {
                success: false,
                error: 'Erro ao revogar a chave.',
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

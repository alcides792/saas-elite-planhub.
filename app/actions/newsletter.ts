'use server';

import { createClient } from '@/lib/utils/supabase/server';

export async function subscribeToNewsletter(email: string) {
    if (!email || !email.includes('@')) {
        return { error: 'E-mail inválido' };
    }

    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email });

        if (error) {
            // PostgreSQL unique violation error code
            if (error.code === '23505') {
                return { error: 'Este e-mail já está inscrito na newsletter!' };
            }
            console.error('Newsletter subscription error:', error);
            return { error: 'Erro ao processar sua inscrição. Tente novamente.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Unexpected error in newsletter subscription:', error);
        return { error: 'Erro inesperado ao realizar sua inscrição.' };
    }
}

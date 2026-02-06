import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { addMonths, addYears, format } from 'date-fns';

// Inicialização com Service Role para garantir permissão de escrita via link de e-mail/telegram
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    const publicUrl = process.env.NEXT_PUBLIC_URL || '';

    // Validação básica de parâmetros
    if (!id || !action) {
        return NextResponse.redirect(`${publicUrl}/dashboard?error=failed`);
    }

    try {
        // --- AÇÃO: DELETE (CANCELAR) ---
        if (action === 'delete') {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return NextResponse.redirect(`${publicUrl}/dashboard?alert=deleted`);
        }

        // --- AÇÃO: RENEW (RENOVAR) ---
        if (action === 'renew') {
            // 1. Busca os detalhes da assinatura para saber o ciclo (billing_type)
            const { data: sub, error: fetchError } = await supabase
                .from('subscriptions')
                .select('billing_type')
                .eq('id', id)
                .single();

            if (fetchError || !sub) throw fetchError || new Error('Subscription not found');

            // 2. Calcula a nova data baseada em HOJE (confirmação do usuário)
            const hoje = new Date();
            const novaData = sub.billing_type === 'yearly'
                ? addYears(hoje, 1)
                : addMonths(hoje, 1);

            // 3. Atualiza o banco de dados
            const { error: updateError } = await supabase
                .from('subscriptions')
                .update({
                    renewal_date: format(novaData, 'yyyy-MM-dd'),
                    status: 'active'
                })
                .eq('id', id);

            if (updateError) throw updateError;
            return NextResponse.redirect(`${publicUrl}/dashboard?alert=renewed`);
        }

        // Se a ação não for nem delete nem renew
        return NextResponse.redirect(`${publicUrl}/dashboard?error=failed`);

    } catch (error: any) {
        console.error('API Action Error:', error);
        return NextResponse.redirect(`${publicUrl}/dashboard?error=failed`);
    }
}

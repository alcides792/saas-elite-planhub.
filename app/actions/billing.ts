'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const DODO_API_URL = 'https://live.dodopayments.com' // Garanta que está em Live
const DODO_API_KEY = process.env.DODO_PAYMENTS_SECRET_KEY

export async function cancelSubscription(subscriptionId: string | null) {
    if (!subscriptionId) {
        return { success: false, message: "Erro: ID da assinatura não encontrado." }
    }

    try {
        // CORREÇÃO: Usando PATCH conforme documentação oficial
        const response = await fetch(`${DODO_API_URL}/subscriptions/${subscriptionId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${DODO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cancel_at_next_billing_date: true
            })
        })

        if (!response.ok) {
            console.error('Erro Dodo:', await response.text())
            return { success: false, message: `Erro ao cancelar: ${response.status}` }
        }

        // Atualiza status no Supabase
        // Nota: Tecnicamente o acesso continua até o fim do ciclo, mas marcamos como
        // 'canceled' aqui para o botão de cancelar sumir da tela.
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase
                .from('profiles')
                .update({
                    billing_status: 'canceled', // Ou você pode criar um status 'canceling' se preferir
                    plan_name: 'Free'
                })
                .eq('id', user.id)
        }

        revalidatePath('/dashboard/billing')
        return { success: true, message: "Renovação automática cancelada com sucesso!" }

    } catch (error: any) {
        console.error(error)
        return { success: false, message: "Erro de conexão." }
    }
}

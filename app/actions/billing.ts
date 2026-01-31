'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const DODO_API_URL = 'https://live.dodopayments.com'
// CORREÇÃO: Usando o nome exato que está no .env do usuário
const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY

export async function cancelSubscription(subscriptionId: string | null) {
    if (!subscriptionId) {
        return { success: false, message: "Erro: ID da assinatura não encontrado." }
    }

    // Debug de Segurança (apenas para ver se a chave foi carregada)
    if (!DODO_API_KEY) {
        console.error("ERRO CRÍTICO: DODO_PAYMENTS_API_KEY não encontrada nas variáveis de ambiente.")
        return { success: false, message: "Erro de configuração no servidor (Chave ausente)." }
    }

    try {
        const response = await fetch(`${DODO_API_URL}/subscriptions/${subscriptionId}`, {
            method: 'PATCH', // Mantendo o método PATCH correto
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

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase
                .from('profiles')
                .update({ billing_status: 'canceled', plan_name: 'Free' })
                .eq('id', user.id)
        }

        revalidatePath('/dashboard/billing')
        return { success: true, message: "Renovação automática cancelada com sucesso!" }

    } catch (error: any) {
        console.error(error)
        return { success: false, message: "Erro de conexão." }
    }
}

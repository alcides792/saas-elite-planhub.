'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// IMPORTANTE: Certifique-se de que DODO_PAYMENTS_SECRET_KEY está no .env.local
const DODO_API_URL = 'https://live.dodopayments.com'
const DODO_API_KEY = process.env.DODO_PAYMENTS_SECRET_KEY

export async function cancelSubscription(subscriptionId: string | null) {
    // Validação explícita
    if (!subscriptionId) {
        return { success: false, message: "Erro: Usuário sem ID de assinatura no banco de dados." }
    }

    if (!DODO_API_KEY) {
        return { success: false, message: "Erro: Chave de API do Dodo não configurada no servidor." }
    }

    try {
        const response = await fetch(`${DODO_API_URL}/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${DODO_API_KEY}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const text = await response.text()
            console.error('Erro API Dodo:', text)
            return { success: false, message: `Falha no Dodo Payments: ${response.status}` }
        }

        // Atualiza banco local
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase
                .from('profiles')
                .update({ billing_status: 'canceled', plan_name: 'Free' })
                .eq('id', user.id)
        }

        revalidatePath('/dashboard/billing')
        return { success: true, message: "Assinatura cancelada com sucesso!" }

    } catch (error: any) {
        console.error(error)
        return { success: false, message: "Erro interno no servidor." }
    }
}

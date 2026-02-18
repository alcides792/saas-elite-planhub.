'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const DODO_API_URL = 'https://live.dodopayments.com'
// CORREÇÃO: Usando o nome exato que está no .env do usuário
const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY

export async function cancelSubscription(subscriptionId: string | null) {
    if (!subscriptionId) {
        return { success: false, message: "Error: Subscription ID not found." }
    }

    // Debug de Segurança (apenas para ver se a chave foi carregada)
    if (!DODO_API_KEY) {
        console.error("CRITICAL ERROR: DODO_PAYMENTS_API_KEY not found in environment variables.")
        return { success: false, message: "Server configuration error (Missing Key)." }
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
            console.error('Dodo Error:', await response.text())
            return { success: false, message: `Error cancelling: ${response.status}` }
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
        return { success: true, message: "Auto-renewal cancelled successfully!" }

    } catch (error: any) {
        console.error(error)
        return { success: false, message: "Connection error." }
    }
}

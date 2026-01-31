'use server'

import { createClient } from '@/utils/supabase/server'

const DODO_API_URL = 'https://live.dodopayments.com'
const DODO_API_KEY = process.env.DODO_PAYMENTS_SECRET_KEY
const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID

export async function createCheckoutSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return { error: "Usuário não logado" }

    try {
        const response = await fetch(`${DODO_API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DODO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: DODO_PRODUCT_ID,
                billing_country: 'BR',
                customer: {
                    email: user.email,
                    name: user.user_metadata?.full_name || 'Cliente'
                },
                return_url: 'http://localhost:3000/dashboard/billing'
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro Checkout Dodo:', data)
            return { error: "Falha ao criar pagamento" }
        }

        if (data.payment_link) {
            return { url: data.payment_link }
        }

        return { error: "Link de pagamento não gerado." }

    } catch (error) {
        console.error(error)
        return { error: "Erro interno ao iniciar checkout." }
    }
}

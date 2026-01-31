'use server'

import DodoPayments from "dodopayments";
import { createClient } from '@/utils/supabase/server'

// Inicialização segura do cliente Dodo
const dodo = process.env.DODO_PAYMENTS_API_KEY
    ? new DodoPayments({
        bearerToken: process.env.DODO_PAYMENTS_API_KEY,
        environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
    })
    : null;

export async function createCheckoutSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return { error: "Usuário não logado" }

    if (!dodo) {
        console.error("[Billing/Checkout] Dodo Payments API key is missing");
        return { error: "Dodo Payments não configurado corretamente no servidor." }
    }

    try {
        const session = await dodo.checkoutSessions.create({
            product_cart: [
                {
                    product_id: process.env.DODO_PRODUCT_ID!,
                    quantity: 1,
                },
            ],
            customer: {
                email: user.email,
                name: user.user_metadata?.full_name || 'Cliente'
            },
            billing_country: 'BR',
            metadata: {
                user_id: user.id,
            },
            return_url: process.env.DODO_PAYMENTS_RETURN_URL || 'http://localhost:3000/dashboard/billing'
        })

        if (session.checkout_url) {
            return { url: session.checkout_url }
        }

        return { error: "Link de pagamento não gerado." }

    } catch (error: any) {
        console.error('Erro ao criar sessão de checkout:', error)
        return { error: error?.message || "Erro interno ao iniciar checkout." }
    }
}

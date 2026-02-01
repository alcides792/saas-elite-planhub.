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

// URL FIXA DE PRODUÇÃO (Seu "Site Verdadeiro")
const PRODUCTION_URL = 'https://kovr.vercel.app'

export async function createCheckoutSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return { error: "User not logged in" }

    if (!dodo) {
        console.error("[Billing/Checkout] Dodo Payments API key is missing");
        return { error: "Dodo Payments not correctly configured on the server." }
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
                name: user.user_metadata?.full_name || 'Customer'
            },
            billing_address: {
                country: 'BR',
            },
            metadata: {
                user_id: user.id,
            },
            // AQUI ESTÁ A MÁGICA: Redireciona direto para o Billing do site oficial
            return_url: `${PRODUCTION_URL}/dashboard/billing`
        })

        if (session.checkout_url) {
            return { url: session.checkout_url }
        }

        return { error: "Checkout link not generated." }

    } catch (error: any) {
        console.error('Error creating checkout session:', error)
        return { error: error?.message || "Internal error starting checkout." }
    }
}

import { Webhooks } from "@dodopayments/nextjs";
import { createClient } from "@supabase/supabase-js";

// Supabase admin (service role) — necessário para atualizar qualquer usuário
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export const POST = Webhooks({
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY || "dummy_key_for_build",

    // 🟡 Assinatura criada / trial começou
    onSubscriptionActive: async (payload: any) => {
        const subscription = payload.data;

        const userId = subscription.metadata?.user_id;
        if (!userId) return;

        console.log("Subscription Active for user:", userId);

        await supabase
            .from("profiles")
            .update({
                billing_status: "trial_active",
                dodo_subscription_id: subscription.id,
                trial_ends_at: subscription.trial_end
                    ? new Date(subscription.trial_end * 1000).toISOString()
                    : null,
            })
            .eq("id", userId);
    },

    // 🟢 Pagamento confirmado após trial
    onPaymentSucceeded: async (payload: any) => {
        const payment = payload.data;
        const subscription = payment.subscription;

        const userId = subscription?.metadata?.user_id;
        if (!userId) return;

        console.log("Payment succeeded for user:", userId);

        await supabase
            .from("profiles")
            .update({
                billing_status: "active",
            })
            .eq("id", userId);
    },

    // 🔴 Falha na cobrança
    onPaymentFailed: async (payload: any) => {
        const payment = payload.data;
        const subscription = payment.subscription;

        const userId = subscription?.metadata?.user_id;
        if (!userId) return;

        console.log("Payment failed for user:", userId);

        await supabase
            .from("profiles")
            .update({
                billing_status: "past_due",
            })
            .eq("id", userId);
    },

    // ⚫ Assinatura cancelada
    onSubscriptionCancelled: async (payload: any) => {
        const subscription = payload.data;

        const userId = subscription.metadata?.user_id;
        if (!userId) return;

        console.log("Subscription cancelled for user:", userId);

        await supabase
            .from("profiles")
            .update({
                billing_status: "cancelled",
            })
            .eq("id", userId);
    },

    // 🔄 Mudanças gerais (renovação, status update, etc)
    onSubscriptionUpdated: async (payload: any) => {
        const subscription = payload.data;
        const userId = subscription.metadata?.user_id;
        if (!userId) return;

        console.log("Subscription updated:", subscription.status);

        // Se estiver ativa e não estiver em trial
        if (subscription.status === "active" && !subscription.trial_end) {
            await supabase
                .from("profiles")
                .update({ billing_status: "active" })
                .eq("id", userId);
        }
    },
});

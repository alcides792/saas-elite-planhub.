import DodoPayments from "dodopayments";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";

// Use conditional initialization to prevent crash if env variables are missing
const dodo = process.env.DODO_PAYMENTS_API_KEY
    ? new DodoPayments({
        bearerToken: process.env.DODO_PAYMENTS_API_KEY,
        environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
    })
    : null;

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!dodo) {
            console.error("[Billing/Checkout] Dodo Payments API key is missing");
            return NextResponse.json({ error: "Dodo Payments not configured. Please set DODO_PAYMENTS_API_KEY." }, { status: 500 });
        }

        const session = await dodo.checkoutSessions.create({
            product_cart: [
                {
                    product_id: process.env.DODO_PRODUCT_ID!,
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 3,
            },
            customer: {
                email: user.email!,
                name: user.user_metadata?.full_name || "User",
            },
            metadata: {
                user_id: user.id, // Securely set via server-side session
            },
            return_url: process.env.DODO_PAYMENTS_RETURN_URL!,
        });

        return NextResponse.json({ checkoutUrl: session.checkout_url });

    } catch (err) {
        console.error("Checkout error:", err);
        return NextResponse.json({ error: "Checkout failed", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
}

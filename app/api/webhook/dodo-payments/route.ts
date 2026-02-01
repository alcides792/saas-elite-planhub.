import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 1. Initialize Supabase with Service Role (Admin privileges)
// This allows finding and editing users by email only
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        // Read JSON sent by Dodo
        const body = await request.json()

        // Extract fields
        const { type, data } = body

        console.log(`🔔 Dodo Webhook Received: [${type}]`)

        // Check if it's a Subscription Active or Payment Success event
        if (type === 'subscription.active' || type === 'payment.succeeded') {

            // Exact mapping according to docs
            const customerEmail = data.customer?.email
            const subscriptionId = data.subscription_id
            const status = data.status || 'active'

            // Intelligent Trial Logic:
            // If "trial_period_days" is in JSON, calculate end date
            let trialEnd = null;
            if (data.trial_period_days && data.trial_period_days > 0) {
                const today = new Date();
                today.setDate(today.getDate() + data.trial_period_days); // Add days
                trialEnd = today.toISOString();
            }

            if (customerEmail) {
                console.log(`👤 Processing user: ${customerEmail}`)

                // Update profile in Supabase
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        billing_status: trialEnd ? 'trialing' : 'active', // If has trial date, mark as trialing
                        dodo_subscription_id: subscriptionId,
                        trial_ends_at: trialEnd, // Save trial end date
                        plan_name: 'Pro' // Or map from data.product_id if needed
                    })
                    .eq('email', customerEmail)

                if (error) {
                    console.error('❌ Error saving to database:', error)
                    return NextResponse.json({ error: 'Database Error' }, { status: 500 })
                }

                console.log(`✅ Success! User ${customerEmail} updated.`)
            } else {
                console.warn('⚠️ Email not found in Dodo JSON.')
            }
        }

        // Cancellation Event
        if (type === 'subscription.cancelled' || type === 'subscription.failed') {
            const customerEmail = data.customer?.email
            if (customerEmail) {
                await supabase
                    .from('profiles')
                    .update({ billing_status: 'canceled' })
                    .eq('email', customerEmail)
                console.log(`🚫 Subscription for ${customerEmail} cancelled.`)
            }
        }

        // Return 200 to Dodo
        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error('🔥 Fatal Webhook Error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

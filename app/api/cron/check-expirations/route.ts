import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { format } from 'date-fns'
import { getExpiringEmailHtml } from '@/lib/utils/email-template'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendTelegramMessage(chatId: string, message: string, buttons: any[]) {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_TOKEN) return;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [buttons]
                }
            })
        });
    } catch (e) {
        console.error('Error sending Telegram message:', e);
    }
}

export async function GET(request: Request) {
    // 1. Security Check
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        // Today in YYYY-MM-DD
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        const publicUrl = process.env.NEXT_PUBLIC_URL || 'https://kovr.space'

        // 2. Fetch all subscriptions expiring TODAY
        const { data: subs, error: subsError } = await supabase
            .from('subscriptions')
            .select(`
                id,
                name,
                amount,
                currency,
                renewal_date,
                website,
                user_id,
                profiles (
                    email,
                    full_name,
                    notify_expiration,
                    telegram_chat_id
                )
            `)
            .eq('renewal_date', todayStr)
            .eq('status', 'active')

        if (subsError) throw subsError

        if (!subs || subs.length === 0) {
            return NextResponse.json({ message: 'No subscriptions expiring today.' })
        }

        let results = []

        for (const sub of subs) {
            const profile: any = sub.profiles
            if (!profile || profile.notify_expiration === false) continue;

            const subResults: any = { id: sub.id, name: sub.name, actions: [] };

            // --- EMAIL NOTIFICATION ---
            if (profile.email) {
                try {
                    const renewLink = `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=renew`
                    const cancelLink = `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=delete`

                    const emailHtml = getExpiringEmailHtml(
                        profile.full_name || 'Assinante',
                        sub.name,
                        renewLink,
                        cancelLink,
                        (sub as any).website || null
                    )

                    await resend.emails.send({
                        from: 'Kovr <noreply@kovr.space>',
                        to: [profile.email],
                        subject: `🤖 Kovr Alerta: A sua assinatura ${sub.name} vence hoje!`,
                        html: emailHtml
                    })
                    subResults.actions.push('email_sent');
                } catch (e: any) {
                    subResults.actions.push(`email_failed: ${e.message}`);
                }
            }

            // --- TELEGRAM NOTIFICATION ---
            if (profile.telegram_chat_id) {
                try {
                    const message = `🚨 <b>Atenção!</b>\n\nA sua assinatura <b>${sub.name}</b> (${sub.currency} ${sub.amount}) vence hoje!\n\nO que deseja fazer?`;
                    const buttons = [
                        { text: "✅ Manter Ativa", url: `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=renew` },
                        { text: "❌ Cancelar Agora", url: `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=delete` }
                    ];

                    await sendTelegramMessage(profile.telegram_chat_id, message, buttons);
                    subResults.actions.push('telegram_sent');
                } catch (e: any) {
                    subResults.actions.push(`telegram_failed: ${e.message}`);
                }
            }

            results.push(subResults);
        }

        return NextResponse.json({ success: true, processed: results })

    } catch (error: any) {
        console.error('Cron Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

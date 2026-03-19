import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { differenceInCalendarDays, format } from 'date-fns'
import { getExpiringEmailHtml } from '@/lib/utils/email-template'

// ─── Admin client (no user session in cron routes) ───
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Notification helpers (admin-scoped, no session needed) ───

async function sendTelegram(chatId: string, message: string, buttons?: any[]) {
    if (!TELEGRAM_TOKEN) return
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            ...(buttons && buttons.length > 0
                ? { reply_markup: { inline_keyboard: [buttons] } }
                : {}),
        }),
    })
}

async function sendDiscord(webhookUrl: string, message: string) {
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'Kovr Bot',
            content: message,
        }),
    })
}

async function dispatchToUser(
    profile: { telegram_chat_id?: string | null; discord_webhook?: string | null },
    messageHTML: string,
    messageMD: string,
    buttons?: any[]
) {
    const promises: Promise<void>[] = []

    if (profile.telegram_chat_id) {
        promises.push(sendTelegram(profile.telegram_chat_id, messageHTML, buttons))
    }
    if (profile.discord_webhook) {
        promises.push(sendDiscord(profile.discord_webhook, messageMD))
    }

    await Promise.allSettled(promises)
}

// ─── GET handler (Vercel Cron — runs every hour) ───

export async function GET(request: Request) {
    // 1. Security: validate CRON_SECRET
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        // 2. Current date & hour (UTC — Vercel crons run in UTC)
        const now = new Date()
        const currentHour = now.getUTCHours()
        const todayStr = format(now, 'yyyy-MM-dd')
        const publicUrl = process.env.NEXT_PUBLIC_URL || 'https://kovr.space'

        // 3. Fetch ALL active subscriptions with user notification preferences
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
                    full_name,
                    telegram_chat_id,
                    discord_webhook,
                    notify_days_before,
                    notify_time,
                    notify_expiration,
                    notify_emails
                )
            `)
            .eq('status', 'active')

        if (subsError) throw subsError

        if (!subs || subs.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No active subscriptions found.',
                alerts_sent: 0,
            })
        }

        // 4. Process each subscription against user preferences
        let alertsSent = 0
        let errorsCount = 0
        const results: { sub_id: string; sub_name: string; action: string }[] = []

        for (const sub of subs) {
            try {
                const profile = sub.profiles as any
                if (!profile) continue

                // Fetch user email from auth.users (not stored in profiles table)
                let userEmail: string | null = null
                try {
                    const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(sub.user_id)
                    if (authErr) {
                        console.error(`[cron/alerts] Auth admin error for user ${sub.user_id}:`, authErr.message)
                    }
                    userEmail = authUser?.user?.email || null
                } catch (e: any) {
                    console.error(`[cron/alerts] Failed to fetch email for user ${sub.user_id}:`, e.message)
                }

                // Extract user preferences with sensible defaults
                const notifyDaysBefore: number = profile.notify_days_before ?? 3
                const notifyTime: number = profile.notify_time ?? 9
                const notifyExpiration: boolean = profile.notify_expiration !== false
                const notifyEmails: boolean = profile.notify_emails !== false

                // ── Hour check: only proceed if current UTC hour matches user preference ──
                // Allow a ±1 hour margin to handle slight cron delays
                const hourMatch = Math.abs(currentHour - notifyTime) <= 1

                if (!hourMatch) continue

                // ── Calculate days until renewal ──
                const renewalDate = new Date(sub.renewal_date + 'T00:00:00Z')
                const daysUntilRenewal = differenceInCalendarDays(renewalDate, new Date(todayStr + 'T00:00:00Z'))

                // Skip past renewals
                if (daysUntilRenewal < 0) continue

                // ── Build action links ──
                const renewLink = `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=renew`
                const cancelLink = `${publicUrl}/api/subscriptions/action?id=${sub.id}&action=delete`

                // ── Rule A: Advance warning (X days before) ──
                if (daysUntilRenewal === notifyDaysBefore) {
                    const daysLabel = notifyDaysBefore > 1 ? `${notifyDaysBefore} days` : '1 day'
                    const formattedDate = format(renewalDate, 'dd/MM/yyyy')

                    // Telegram (HTML)
                    const messageHTML = `🚨 <b>KOVR INSIGHT: Project Your Savings!</b>\n\n` +
                        `Your <b>${sub.name}</b> subscription renews in <b>${daysLabel}</b>.\n\n` +
                        `📊 <b>Transaction Summary:</b>\n` +
                        `• <b>Service:</b> ${sub.name}\n` +
                        `• <b>Investment:</b> <code>${sub.currency} ${sub.amount}</code>\n` +
                        `• <b>Critical Date:</b> ${formattedDate}\n\n` +
                        `💡 <b>Kovr Tip:</b>\n` +
                        `Don't leave your money on autopilot. If this service is no longer part of your routine, cancel it now and save <b>${sub.currency} ${sub.amount}</b> this month!\n\n` +
                        `⚠️ <b>Required Action:</b>\n` +
                        `To stop the charge, the cancellation must be done on the official panel of <a href="${sub.website || '#'}">${sub.name}</a>.\n\n` +
                        `<i>After canceling on the site, click below to update your dashboard.</i>`

                    // Discord (Markdown)
                    const messageMD = `🚨 **KOVR INSIGHT: Project Your Savings!**\n\n` +
                        `Your **${sub.name}** subscription renews in **${daysLabel}**.\n\n` +
                        `📊 **Transaction Summary:**\n` +
                        `• **Service:** ${sub.name}\n` +
                        `• **Investment:** \`${sub.currency} ${sub.amount}\`\n` +
                        `• **Critical Date:** ${formattedDate}\n\n` +
                        `💡 **Kovr Tip:**\n` +
                        `Don't leave your money on autopilot. If this service is no longer part of your routine, cancel it now and save **${sub.currency} ${sub.amount}** this month!\n\n` +
                        `⚠️ **Required Action:**\n` +
                        `To stop the charge, the cancellation must be done on the official panel:\n` +
                        `🔗 [Access ${sub.name} website](${sub.website || 'https://google.com'})\n\n` +
                        `*After canceling on the site, click below to update your dashboard.*`

                    const telegramButtons = [
                        { text: '✅ I\'ll Keep It', url: renewLink },
                        { text: '✂️ Already Canceled', url: cancelLink },
                    ]

                    await dispatchToUser(profile, messageHTML, messageMD, telegramButtons)

                    // Email notification
                    if (notifyEmails && userEmail) {
                        try {
                            const emailHtml = getExpiringEmailHtml(
                                profile.full_name || 'Subscriber',
                                sub.name,
                                renewLink,
                                cancelLink,
                                (sub as any).website || null
                            )
                            const emailResult = await resend.emails.send({
                                from: 'Kovr <noreply@kovr.space>',
                                to: [userEmail],
                                subject: `🚨 Kovr Alert: Your ${sub.name} subscription renews in ${daysLabel}!`,
                                html: emailHtml,
                            })
                        } catch (emailErr: any) {
                            console.error(`[cron/alerts] Email FAILED for sub ${sub.id}:`, emailErr.message, emailErr)
                        }
                    } else {
                        console.warn(`[cron/alerts] Email SKIPPED for sub ${sub.name}: notifyEmails=${notifyEmails}, userEmail=${userEmail}`)
                    }

                    alertsSent++
                    results.push({ sub_id: sub.id, sub_name: sub.name, action: `advance_alert_${notifyDaysBefore}d` })
                    continue // Don't send both alerts for the same subscription
                }

                // ── Rule B: Same-day warning (renewal day) ──
                if (daysUntilRenewal === 0 && notifyExpiration) {
                    // Telegram (HTML) / Discord (Markdown) messages
                    const messageHTML = `⚠️ <b>Kovr Alert:</b> Your <b>${sub.name}</b> subscription (${sub.currency} ${sub.amount}) renews <b>TODAY</b>!`
                    const messageMD = `⚠️ **Kovr Alert:** Your **${sub.name}** subscription (${sub.currency} ${sub.amount}) renews **TODAY**!`

                    const telegramButtons = [
                        { text: '✅ I\'ll Keep It', url: renewLink },
                        { text: '✂️ Already Canceled', url: cancelLink },
                    ]

                    await dispatchToUser(profile, messageHTML, messageMD, telegramButtons)

                    // Email notification
                    if (notifyEmails && userEmail) {
                        try {
                            const emailHtml = getExpiringEmailHtml(
                                profile.full_name || 'Subscriber',
                                sub.name,
                                renewLink,
                                cancelLink,
                                (sub as any).website || null
                            )
                            const emailResult = await resend.emails.send({
                                from: 'Kovr <noreply@kovr.space>',
                                to: [userEmail],
                                subject: `⚠️ Kovr Alert: Your ${sub.name} subscription expires today!`,
                                html: emailHtml,
                            })
                        } catch (emailErr: any) {
                            console.error(`[cron/alerts] Email FAILED for sub ${sub.id}:`, emailErr.message, emailErr)
                        }
                    } else {
                        console.warn(`[cron/alerts] Email SKIPPED for sub ${sub.name}: notifyEmails=${notifyEmails}, userEmail=${userEmail}`)
                    }

                    alertsSent++
                    results.push({ sub_id: sub.id, sub_name: sub.name, action: 'today_alert' })
                }
            } catch (subError: any) {
                errorsCount++
                console.error(`[cron/alerts] Error processing sub ${sub.id}:`, subError.message)
                results.push({ sub_id: sub.id, sub_name: sub.name, action: `error: ${subError.message}` })
            }
        }

        // 5. Response summary
        return NextResponse.json({
            success: true,
            run_at: now.toISOString(),
            current_hour_utc: currentHour,
            total_active_subs: subs.length,
            alerts_sent: alertsSent,
            errors: errorsCount,
            details: results,
        })
    } catch (error: any) {
        console.error('[cron/alerts] Fatal error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

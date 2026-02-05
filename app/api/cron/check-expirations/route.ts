import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Use Service Role para acessar dados de todos os usuários
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
    // Verificação simples de segurança (opcional, para evitar abuso externo)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new NextResponse('Unauthorized', { status: 401 }) 
        // (Comentado para facilitar seu teste manual agora, descomente em produção)
    }

    try {
        // 1. Busca usuários que querem receber alertas e têm Telegram conectado
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, telegram_chat_id, notify_days_before, full_name, email')
            .eq('notify_expiration', true)

        if (!profiles || profiles.length === 0) {
            return NextResponse.json({ message: 'Nenhum perfil elegível encontrado.' })
        }

        let logs = []

        // 2. Para cada usuário, verifica as assinaturas dele
        for (const profile of profiles) {
            const daysBefore = profile.notify_days_before || 3

            // Calcula a "Data Alvo" (Hoje + Dias Configurados)
            const targetDate = new Date()
            targetDate.setDate(targetDate.getDate() + daysBefore)
            const targetString = targetDate.toISOString().split('T')[0] // YYYY-MM-DD

            // Busca assinaturas desse usuário que vencem nessa data exata
            // Ajustado para colunas reais: amount e next_payment
            const { data: subs } = await supabase
                .from('subscriptions')
                .select('name, amount, currency')
                .eq('user_id', profile.id)
                .eq('next_payment', targetString)

            if (subs && subs.length > 0) {
                // 3. Envia Alertas (Telegram + Email)
                for (const sub of subs) {
                    // Telegram Notification
                    if (profile.telegram_chat_id) {
                        try {
                            const message = `⚠️ <b>Aviso de Vencimento Kovr</b>\n\n` +
                                `Olá, <b>${profile.full_name || 'Assinante'}</b>!\n\n` +
                                `Identificamos que a assinatura <b>${sub.name}</b> vencerá em breve:\n` +
                                `📅 Data: <b>${targetString.split('-').reverse().join('/')}</b> (Daqui a ${daysBefore} dias)\n` +
                                `💰 Valor: <b>${sub.currency} ${sub.amount}</b>\n\n` +
                                `<i>Mantenha seu saldo em dia para evitar a interrupção do serviço.</i>`

                            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    chat_id: profile.telegram_chat_id,
                                    text: message,
                                    parse_mode: 'HTML'
                                })
                            })

                            logs.push(`Telegram enviado para ${profile.id}: ${sub.name}`)
                        } catch (telegramError) {
                            console.error('Erro ao enviar Telegram:', telegramError)
                            logs.push(`Telegram FALHOU para ${profile.id}: ${sub.name}`)
                        }
                    }

                    // Email Notification
                    if (profile.email) {
                        try {
                            const emailHtml = `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                </head>
                                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); padding: 32px; text-align: center;">
                                                <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">⚠️ Alerta de Vencimento</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 40px 32px;">
                                                <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Olá <strong>${profile.full_name || 'Assinante'}</strong>,</p>
                                                <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
                                                    A sua assinatura <strong style="color: #a855f7;">${sub.name}</strong> no valor de 
                                                    <strong style="color: #a855f7;">${sub.amount} ${sub.currency}</strong> vence no dia 
                                                    <strong style="color: #dc2626;">${targetString.split('-').reverse().join('/')}</strong>.
                                                </p>
                                                <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                                    <p style="font-size: 14px; color: #92400e; margin: 0;">💡 <strong>Dica:</strong> Verifique o seu saldo e evite cobranças inesperadas.</p>
                                                </div>
                                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                                                    <tr>
                                                        <td align="center">
                                                            <a href="https://kovr.space/dashboard" style="display: inline-block; background-color: #a855f7; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px;">Ir para Dashboard</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <p style="font-size: 14px; color: #6b7280; margin: 24px 0 0 0;">Este é um alerta automático do Kovr. Gerencie todas as suas assinaturas em um só lugar.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                                                <p style="font-size: 12px; color: #9ca3af; margin: 0;">© 2024 Kovr. Todos os direitos reservados.</p>
                                                <p style="font-size: 12px; color: #9ca3af; margin: 8px 0 0 0;">
                                                    <a href="https://kovr.space" style="color: #a855f7; text-decoration: none;">kovr.space</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                                </html>
                            `

                            await resend.emails.send({
                                from: 'Kovr Alerts <alerts@kovr.space>',
                                to: [profile.email],
                                subject: `⚠️ Alerta: ${sub.name} vence em ${daysBefore} dias`,
                                html: emailHtml
                            })

                            logs.push(`Email enviado para ${profile.id}: ${sub.name}`)
                        } catch (emailError) {
                            console.error('Erro ao enviar email:', emailError)
                            logs.push(`Email FALHOU para ${profile.id}: ${sub.name}`)
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, alerts_sent: logs })

    } catch (error: any) {
        console.error('Cron Error:', error)
        return NextResponse.json({ error: 'Falha no Cron: ' + error.message }, { status: 500 })
    }
}

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use Service Role para acessar dados de todos os usuários
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

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
            .select('id, telegram_chat_id, notify_days_before, full_name')
            .not('telegram_chat_id', 'is', null)
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
                // 3. Envia o Alerta para o Telegram
                for (const sub of subs) {
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

                    logs.push(`Enviado para ${profile.id}: ${sub.name}`)
                }
            }
        }

        return NextResponse.json({ success: true, alerts_sent: logs })

    } catch (error: any) {
        console.error('Cron Error:', error)
        return NextResponse.json({ error: 'Falha no Cron: ' + error.message }, { status: 500 })
    }
}

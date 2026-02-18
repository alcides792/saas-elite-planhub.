import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use a Service Role para ignorar RLS (Security) pois é uma ação do sistema
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(request: Request) {
    try {
        const update = await request.json()

        // Validação básica
        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true })
        }

        const text = update.message.text
        const chatId = update.message.chat.id.toString()

        // DETECÇÃO DO DEEP LINK: /start <USER_ID>
        if (text.startsWith('/start ') && text.length > 7) {
            const userId = text.split(' ')[1].trim()


            // Salva no Supabase
            const { error } = await supabase
                .from('profiles')
                .update({ telegram_chat_id: chatId })
                .eq('id', userId)

            if (error) {
                console.error('Supabase Error:', error)
                await sendMessage(chatId, "❌ Error linking account. Please try again.")
            } else {
                await sendMessage(chatId, "✅ **Kovr Connected!**\n\nYou will now receive your expiration alerts here. You can close Telegram.")
            }
        } else if (text === '/start') {
            await sendMessage(chatId, "⚠️ Please use the 'Connect' button inside the Kovr dashboard to start.")
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ ok: false })
    }
}

async function sendMessage(chatId: string, text: string) {
    if (!TELEGRAM_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN is not defined')
        return
    }

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    })
}

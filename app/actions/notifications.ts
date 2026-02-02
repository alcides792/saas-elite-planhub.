'use server'

import { createClient } from '@/utils/supabase/server'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// --- TELEGRAM LOGIC ---

export async function saveTelegramId(chatId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não logado" }

    const { error } = await supabase.from('profiles').update({ telegram_chat_id: chatId }).eq('id', user.id)
    if (error) return { error: "Erro ao salvar Telegram ID" }

    await sendNotification(user.id, "🚀 **Kovr:** Telegram conectado com sucesso!", "telegram")
    return { success: true }
}

// --- DISCORD LOGIC ---

export async function saveDiscordWebhook(url: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não logado" }

    if (!url.includes("discord.com/api/webhooks")) return { error: "URL inválida" }

    const { error } = await supabase.from('profiles').update({ discord_webhook: url }).eq('id', user.id)
    if (error) return { error: "Erro ao salvar Webhook" }

    await sendNotification(user.id, "✅ **Kovr:** Webhook do Discord conectado!", "discord")
    return { success: true }
}

// --- UNIVERSAL SENDER ---

export async function sendNotification(userId: string, message: string, channel: 'telegram' | 'discord' | 'all' = 'all') {
    const supabase = await createClient()

    // Busca as configs do usuário
    const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_chat_id, discord_webhook')
        .eq('id', userId)
        .single()

    if (!profile) return

    // Envia Telegram
    if ((channel === 'all' || channel === 'telegram') && profile.telegram_chat_id && TELEGRAM_TOKEN) {
        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: profile.telegram_chat_id, text: message, parse_mode: 'Markdown' })
            })
        } catch (e) {
            console.error("Error sending Telegram notification:", e)
        }
    }

    // Envia Discord
    if ((channel === 'all' || channel === 'discord') && profile.discord_webhook) {
        try {
            await fetch(profile.discord_webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: "Kovr Bot",
                    content: message
                })
            })
        } catch (e) {
            console.error("Error sending Discord notification:", e)
        }
    }
}

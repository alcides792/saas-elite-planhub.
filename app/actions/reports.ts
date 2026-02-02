'use server'
import { createClient } from '@/utils/supabase/server'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendExportToTelegram(format: 'csv' | 'pdf') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "User not logged in" }

    // 1. Fetch profile (to get Chat ID)
    const { data: profile } = await supabase.from('profiles').select('telegram_chat_id').eq('id', user.id).single()

    if (!profile?.telegram_chat_id) {
        return { success: false, error: "Telegram not connected." }
    }

    // 2. Fetch Subscriptions
    const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', user.id)

    if (!subs || subs.length === 0) {
        return { success: false, error: "No subscriptions found to export." }
    }

    // 3. Generate File (Simplified logic for CSV)
    let fileContent = ''
    let fileName = ''

    if (format === 'csv') {
        // CSV Header
        fileContent = 'Name,Price,Currency,Cycle,Category,Next Payment\n'
        // Rows
        subs.forEach((sub: any) => {
            fileContent += `${sub.name},${sub.price},${sub.currency},${sub.cycle},${sub.category},${sub.next_payment_date}\n`
        })
        fileName = 'kovr_report.csv'
    } else {
        // Simulated PDF (as formatted text for now)
        fileContent = `KOVR SUMMARY\n\nTotal Subscriptions: ${subs.length}\n\n`
        subs.forEach((sub: any) => {
            fileContent += `- ${sub.name}: ${sub.currency} ${sub.price} (${sub.cycle})\n`
        })
        fileName = 'kovr_summary.txt'
    }

    // 4. Send to Telegram (multipart/form-data)
    try {
        const formData = new FormData()
        formData.append('chat_id', profile.telegram_chat_id)
        formData.append('caption', `📊 Here is your report in ${format.toUpperCase()}.`)

        // Create Blob/File for sending
        const fileBlob = new Blob([fileContent], { type: 'text/plain' })
        formData.append('document', fileBlob, fileName)

        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        })

        const data = await res.json()
        if (!data.ok) throw new Error(data.description)

        return { success: true }
    } catch (error: any) {
        console.error('Telegram Export Error:', error)
        return { success: false, error: "Failed to send to Telegram: " + error.message }
    }
}

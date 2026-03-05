import { NextRequest, NextResponse } from 'next/server'
import { saveDiscordWebhook } from '@/app/actions/notifications'

export async function GET(req: NextRequest) {
    const baseUrl = req.nextUrl.origin
    const alertsUrl = `${baseUrl}/dashboard/alerts`

    try {
        // 1. Extract the authorization code
        const code = req.nextUrl.searchParams.get('code')

        if (!code) {
            console.error('[discord/callback] No code received')
            return NextResponse.redirect(`${alertsUrl}?error=no_code`)
        }

        // 2. Exchange the code for a webhook token via Discord API
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                client_secret: process.env.DISCORD_CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`,
            }),
        })

        const data = await tokenRes.json()

        if (!tokenRes.ok || !data.webhook?.url) {
            console.error('[discord/callback] Token exchange failed:', data)
            return NextResponse.redirect(`${alertsUrl}?error=token_exchange_failed`)
        }

        // 3. Save the webhook URL using our existing server action
        const result = await saveDiscordWebhook(data.webhook.url)

        if (result.error) {
            console.error('[discord/callback] Save webhook failed:', result.error)
            return NextResponse.redirect(`${alertsUrl}?error=save_failed`)
        }

        // 4. Redirect back to alerts page with success
        return NextResponse.redirect(`${alertsUrl}?success=discord_connected`)

    } catch (error) {
        console.error('[discord/callback] Unexpected error:', error)
        return NextResponse.redirect(`${alertsUrl}?error=unexpected`)
    }
}

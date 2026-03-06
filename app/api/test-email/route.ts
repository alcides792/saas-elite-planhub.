import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const diagnostics: Record<string, any> = {
        resend_key_set: !!process.env.RESEND_API_KEY,
        resend_key_prefix: process.env.RESEND_API_KEY?.substring(0, 6) || 'NOT SET',
        service_role_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // Step 1: Get first user from profiles
    const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, full_name')
        .limit(1)
        .single()

    if (profErr || !profiles) {
        return NextResponse.json({ ...diagnostics, error: 'No profile found', profErr })
    }

    diagnostics.profile_id = profiles.id
    diagnostics.profile_name = profiles.full_name

    // Step 2: Get email from auth.users
    try {
        const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(profiles.id)

        if (authErr) {
            diagnostics.auth_error = authErr.message
            return NextResponse.json({ ...diagnostics, step_failed: 'auth.admin.getUserById' })
        }

        const userEmail = authUser?.user?.email
        diagnostics.user_email = userEmail || 'NULL'

        if (!userEmail) {
            return NextResponse.json({ ...diagnostics, step_failed: 'No email found in auth.users' })
        }

        // Step 3: Try sending email via Resend
        try {
            const result = await resend.emails.send({
                from: 'Kovr <noreply@kovr.space>',
                to: [userEmail],
                subject: '🧪 Kovr Test Email - Email System Working!',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 12px;">
                        <h2 style="color: #7c3aed;">✅ Email System Test</h2>
                        <p>If you received this, the Resend integration is working correctly!</p>
                        <p><strong>User:</strong> ${profiles.full_name || 'N/A'}</p>
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                    </div>
                `,
            })

            diagnostics.resend_result = result
            diagnostics.email_sent = true

            return NextResponse.json({ success: true, ...diagnostics })
        } catch (emailErr: any) {
            diagnostics.resend_error = emailErr.message
            diagnostics.resend_error_full = JSON.stringify(emailErr, null, 2)
            return NextResponse.json({ success: false, step_failed: 'resend.emails.send', ...diagnostics })
        }
    } catch (e: any) {
        diagnostics.catch_error = e.message
        return NextResponse.json({ success: false, step_failed: 'unexpected', ...diagnostics })
    }
}

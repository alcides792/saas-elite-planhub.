'use server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sender configuration (Use Resend's default email for testing if you don't have a verified domain)
const FROM_EMAIL = 'onboarding@resend.dev'

interface SendEmailProps {
    to: string
    subject: string
    html: string
}

/**
 * Utility to send emails using Resend.
 * Free tier only allows sending to your own registered email address.
 */
export async function sendEmail({ to, subject, html }: SendEmailProps) {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY not found.")
        }

        const data = await resend.emails.send({
            from: `Kovr <${FROM_EMAIL}>`,
            to: [to],
            subject: subject,
            html: html,
        })

        if (data.error) {
            console.error("Resend Error:", data.error)
            return { success: false, error: data.error }
        }

        return { success: true, id: data.data?.id }

    } catch (error) {
        console.error("Failed to send email:", error)
        return { success: false, error: "Internal error in the email server." }
    }
}

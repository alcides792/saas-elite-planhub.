import { NextResponse } from 'next/server'
import { createClient } from '@/lib/utils/supabase/server'
import { Resend } from 'resend'
import { generateSimplePDF, generateSimpleCSV } from '@/lib/generate-simple'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = new Resend(RESEND_API_KEY)

// Helper function to generate professional report HTML
function generateReportHtml(
    userName: string,
    userEmail: string,
    subs: any[],
    totalDisplayHtml: string,
    dataHoje: string
): string {
    const rows = subs.map(sub => `
        <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #111827;">${sub.name}</div>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${sub.category || 'No category'}</div>
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize; color: #6b7280;">
                ${sub.billing_cycle || sub.billing_type || 'Monthly'}
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: #7c3aed;">
                ${sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString('en-US') : '-'}
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #111827;">
                ${new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.currency || 'USD' }).format(Number(sub.amount) || 0)}
            </td>
        </tr>
    `).join('')

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kovr Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background: #ffffff;
            padding: 40px;
            color: #374151;
            line-height: 1.5;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 3px solid #7c3aed;
            margin-bottom: 32px;
        }
        .logo {
            font-size: 32px;
            font-weight: 800;
            color: #0f0f11;
            letter-spacing: -1px;
        }
        .logo-dot {
            color: #7c3aed;
        }
        .logo-subtitle {
            font-size: 12px;
            color: #9ca3af;
            font-weight: 400;
            margin-top: 4px;
        }
        .date-box {
            text-align: right;
        }
        .date-label {
            font-size: 11px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .date-value {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            margin-top: 4px;
        }
        .summary {
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-info h2 {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
        }
        .user-info p {
            font-size: 13px;
            color: #6b7280;
            margin-top: 2px;
        }
        .total-box {
            text-align: right;
        }
        .total-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .total-value {
            font-size: 24px;
            font-weight: 800;
            color: #7c3aed;
            margin-top: 4px;
        }
        .services-count {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 4px;
        }
        .table-section {
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            text-align: left;
            font-size: 10px;
            font-weight: 700;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 12px 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        th:nth-child(3),
        th:nth-child(4) {
            text-align: right;
        }
        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
        }
        .footer p {
            font-size: 11px;
            color: #9ca3af;
        }
        .footer .brand {
            color: #7c3aed;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div>
                <div class="logo">Kovr<span class="logo-dot">.</span></div>
                <div class="logo-subtitle">Subscriptions Report</div>
            </div>
            <div class="date-box">
                <div class="date-label">Issue Date</div>
                <div class="date-value">${dataHoje}</div>
            </div>
        </div>

        <!-- Summary -->
        <div class="summary">
            <div class="user-info">
                <h2>${userName}</h2>
                <p>${userEmail}</p>
            </div>
            <div class="total-box">
                <div class="total-label">Total Monthly Cost</div>
                <div class="total-value">${totalDisplayHtml}</div>
                <div class="services-count">${subs.length} active service${subs.length !== 1 ? 's' : ''}</div>
            </div>
        </div>

        <!-- Subscriptions Table -->
        <div class="table-section">
            <div class="section-title">Your Subscriptions</div>
            <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Cycle</th>
                        <th>Next Renewal</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Report generated automatically via <span class="brand">Kovr</span> • kovr.space</p>
        </div>
    </div>
</body>
</html>
    `
}

export async function POST(request: Request) {
    try {
        const { format, channel } = await request.json()

        if (!format || !channel) {
            return NextResponse.json(
                { success: false, error: 'Format and channel are required' },
                { status: 400 }
            )
        }

        if (!['pdf', 'csv'].includes(format) || !['email', 'telegram'].includes(channel)) {
            return NextResponse.json(
                { success: false, error: 'Invalid format or channel' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // 1. Get user and profile
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not authenticated' },
                { status: 401 }
            )
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('telegram_chat_id, full_name, email')
            .eq('id', user.id)
            .single()

        if (!profile) {
            return NextResponse.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            )
        }

        // Validate channel availability
        if (channel === 'telegram' && !profile.telegram_chat_id) {
            return NextResponse.json(
                { success: false, error: 'Telegram not connected' },
                { status: 400 }
            )
        }

        const userEmail = profile.email || user.email
        if (channel === 'email' && !userEmail) {
            return NextResponse.json(
                { success: false, error: 'Email not available' },
                { status: 400 }
            )
        }

        const userName = profile.full_name || user.user_metadata?.full_name || 'Kovr User'

        // 2. Fetch subscriptions
        const { data: subs, error: subsError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('renewal_date', { ascending: true })

        if (subsError) {
            console.error('Error fetching subscriptions:', subsError)
            return NextResponse.json(
                { success: false, error: 'Error fetching data' },
                { status: 500 }
            )
        }

        if (!subs || subs.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No subscriptions found' },
                { status: 404 }
            )
        }

        // 3. Calculate totals by currency
        const totalsByCurrency: Record<string, number> = {}

        subs.forEach(sub => {
            const currency = sub.currency || 'BRL'
            const amount = Number(sub.amount) || 0

            if (totalsByCurrency[currency]) {
                totalsByCurrency[currency] += amount
            } else {
                totalsByCurrency[currency] = amount
            }
        })

        const formattedTotals = Object.entries(totalsByCurrency).map(([currency, value]) => {
            try {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
            } catch (e) {
                return `${currency} ${value.toFixed(2)}`
            }
        })

        const totalDisplayHtml = formattedTotals.join('<br>')
        const totalDisplayText = formattedTotals.join(' + ')
        const dataHoje = new Date().toLocaleDateString('en-US')

        // 4. Generate file content based on format
        if (format === 'csv') {
            // CSV Export usando gerador leve
            const csvBuffer = generateSimpleCSV(subs)
            const fileName = `kovr_report_${Date.now()}.csv`

            if (channel === 'telegram') {
                const formData = new FormData()
                formData.append('chat_id', profile.telegram_chat_id)

                const caption = `📊 <b>Kovr Financial Report</b>\n\n` +
                    `👤 ${userName}\n` +
                    `📅 ${dataHoje}\n\n` +
                    `💰 <b>Estimated Totals:</b>\n${totalDisplayText}\n\n` +
                    `<i>Download the file to view.</i>`

                formData.append('caption', caption)
                formData.append('parse_mode', 'HTML')

                const fileBlob = new Blob([new Uint8Array(csvBuffer)], { type: 'text/csv' })
                formData.append('document', fileBlob, fileName)

                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()
                if (!data.ok) {
                    throw new Error(data.description || 'Error sending to Telegram')
                }

                return NextResponse.json({ success: true })
            } else {
                // Email CSV
                const emailRes = await resend.emails.send({
                    from: 'Kovr <noreply@kovr.space>',
                    to: userEmail,
                    subject: `📊 CSV Report - ${dataHoje}`,
                    html: `
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                            <div style="text-align: center; margin-bottom: 32px;">
                                <h1 style="font-size: 28px; font-weight: 800; color: #0f0f11; margin: 0;">Kovr<span style="color: #7c3aed;">.</span></h1>
                            </div>
                            <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Hello, ${userName}!</h2>
                            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Attached is your simplified report in <strong>CSV</strong> format.
                            </p>
                            <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Summary:</p>
                                <p style="color: #7c3aed; font-size: 20px; font-weight: 700; margin: 0;">${totalDisplayText}</p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">${subs.length} service${subs.length !== 1 ? 's' : ''}</p>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                                Report generated automatically on ${dataHoje}
                            </p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: fileName,
                            content: csvBuffer,
                        }
                    ]
                })

                if (emailRes.error) {
                    console.error('Resend Error:', emailRes.error)
                    return NextResponse.json(
                        { success: false, error: 'Error sending email' },
                        { status: 500 }
                    )
                }

                return NextResponse.json({ success: true })
            }
        } else {
            // PDF Export using PDFKit (lightweight, no browser)
            const pdfBuffer = await generateSimplePDF(subs)
            const fileName = `Kovr-Report-${dataHoje.replace(/\//g, '-')}.pdf`

            if (channel === 'telegram') {
                const formData = new FormData()
                formData.append('chat_id', profile.telegram_chat_id)

                const caption = `📊 <b>Kovr Financial Report </b>\n\n` +
                    `👤 ${userName}\n` +
                    `📅 ${dataHoje}\n\n` +
                    `💰 <b>Estimated Totals:</b>\n${totalDisplayText}\n\n` +
                    `📎 <i>Simplified PDF attached</i>`

                formData.append('caption', caption)
                formData.append('parse_mode', 'HTML')

                const fileBlob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' })
                formData.append('document', fileBlob, fileName)

                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()
                if (!data.ok) {
                    throw new Error(data.description || 'Error sending to Telegram')
                }

                return NextResponse.json({ success: true })
            } else {
                // Email PDF
                const emailRes = await resend.emails.send({
                    from: 'Kovr <noreply@kovr.space>',
                    to: userEmail,
                    subject: `📊 PDF Report - ${dataHoje}`,
                    html: `
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                            <div style="text-align: center; margin-bottom: 32px;">
                                <h1 style="font-size: 28px; font-weight: 800; color: #0f0f11; margin: 0;">Kovr<span style="color: #7c3aed;">.</span></h1>
                            </div>
                            <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Hello, ${userName}!</h2>
                            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Attached is your simplified subscription report in <strong>PDF</strong> format.
                            </p>
                            <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Summary:</p>
                                <p style="color: #7c3aed; font-size: 20px; font-weight: 700; margin: 0;">${totalDisplayText}</p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">${subs.length} service${subs.length !== 1 ? 's' : ''}</p>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                                Report generated automatically on ${dataHoje}
                            </p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: fileName,
                            content: pdfBuffer,
                        }
                    ]
                })

                if (emailRes.error) {
                    console.error('Erro Resend:', emailRes.error)
                    return NextResponse.json(
                        { success: false, error: 'Erro ao enviar e-mail' },
                        { status: 500 }
                    )
                }

                return NextResponse.json({ success: true })
            }
        }

    } catch (error: any) {
        console.error('Export Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

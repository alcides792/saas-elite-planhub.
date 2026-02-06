import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { generatePdfBuffer } from '@/lib/generate-pdf'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = new Resend(RESEND_API_KEY)

// Função auxiliar para gerar o HTML profissional do relatório
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
                <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${sub.category || 'Sem categoria'}</div>
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize; color: #6b7280;">
                ${sub.billing_cycle || sub.billing_type || 'Mensal'}
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: #7c3aed;">
                ${sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString('pt-BR') : '-'}
            </td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #111827;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: sub.currency || 'BRL' }).format(Number(sub.amount) || 0)}
            </td>
        </tr>
    `).join('')

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Kovr</title>
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
                <div class="logo-subtitle">Relatório de Assinaturas</div>
            </div>
            <div class="date-box">
                <div class="date-label">Data de Emissão</div>
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
                <div class="total-label">Custo Mensal Total</div>
                <div class="total-value">${totalDisplayHtml}</div>
                <div class="services-count">${subs.length} serviço${subs.length !== 1 ? 's' : ''} ativo${subs.length !== 1 ? 's' : ''}</div>
            </div>
        </div>

        <!-- Subscriptions Table -->
        <div class="table-section">
            <div class="section-title">Suas Assinaturas</div>
            <table>
                <thead>
                    <tr>
                        <th>Serviço</th>
                        <th>Ciclo</th>
                        <th>Próx. Renovação</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Relatório gerado automaticamente via <span class="brand">Kovr</span> • kovr.space</p>
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
                { success: false, error: 'Formato e canal são obrigatórios' },
                { status: 400 }
            )
        }

        if (!['pdf', 'csv'].includes(format) || !['email', 'telegram'].includes(channel)) {
            return NextResponse.json(
                { success: false, error: 'Formato ou canal inválido' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // 1. Get user and profile
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não autenticado' },
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
                { success: false, error: 'Perfil não encontrado' },
                { status: 404 }
            )
        }

        // Validate channel availability
        if (channel === 'telegram' && !profile.telegram_chat_id) {
            return NextResponse.json(
                { success: false, error: 'Telegram não conectado' },
                { status: 400 }
            )
        }

        const userEmail = profile.email || user.email
        if (channel === 'email' && !userEmail) {
            return NextResponse.json(
                { success: false, error: 'E-mail não disponível' },
                { status: 400 }
            )
        }

        const userName = profile.full_name || user.user_metadata?.full_name || 'Usuário Kovr'

        // 2. Fetch subscriptions
        const { data: subs, error: subsError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('renewal_date', { ascending: true })

        if (subsError) {
            console.error('Erro ao buscar assinaturas:', subsError)
            return NextResponse.json(
                { success: false, error: 'Erro ao buscar dados' },
                { status: 500 }
            )
        }

        if (!subs || subs.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Nenhuma assinatura encontrada' },
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
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
            } catch (e) {
                return `${currency} ${value.toFixed(2)}`
            }
        })

        const totalDisplayHtml = formattedTotals.join('<br>')
        const totalDisplayText = formattedTotals.join(' + ')
        const dataHoje = new Date().toLocaleDateString('pt-BR')

        // 4. Generate file content based on format
        if (format === 'csv') {
            // CSV Export
            const header = 'Nome,Preço,Moeda,Ciclo,Categoria,Início,Próx. Renovação\n'
            const rows = subs.map(sub => {
                const inicio = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : '-'
                const renovacao = sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString('pt-BR') : '-'
                return `"${sub.name}",${sub.amount},${sub.currency},${sub.billing_type || sub.billing_cycle},${sub.category},${inicio},${renovacao}`
            }).join('\n')

            const fileContent = header + rows
            const fileName = `kovr_relatorio_${Date.now()}.csv`

            if (channel === 'telegram') {
                const formData = new FormData()
                formData.append('chat_id', profile.telegram_chat_id)

                const caption = `📊 <b>Relatório Financeiro Kovr</b>\n\n` +
                    `👤 ${userName}\n` +
                    `📅 ${dataHoje}\n\n` +
                    `💰 <b>Totais Estimados:</b>\n${totalDisplayText}\n\n` +
                    `<i>Baixe o arquivo para visualizar.</i>`

                formData.append('caption', caption)
                formData.append('parse_mode', 'HTML')

                const fileBlob = new Blob([fileContent], { type: 'text/csv' })
                formData.append('document', fileBlob, fileName)

                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()
                if (!data.ok) {
                    throw new Error(data.description || 'Erro ao enviar para Telegram')
                }

                return NextResponse.json({ success: true })
            } else {
                // Email CSV
                const buffer = Buffer.from(fileContent, 'utf-8')

                const emailRes = await resend.emails.send({
                    from: 'Kovr <noreply@kovr.space>',
                    to: userEmail,
                    subject: `📊 Relatório CSV - ${dataHoje}`,
                    html: `
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                            <div style="text-align: center; margin-bottom: 32px;">
                                <h1 style="font-size: 28px; font-weight: 800; color: #0f0f11; margin: 0;">Kovr<span style="color: #7c3aed;">.</span></h1>
                            </div>
                            <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Olá, ${userName}!</h2>
                            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Seu relatório de assinaturas está em anexo no formato <strong>CSV</strong>.
                            </p>
                            <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Resumo:</p>
                                <p style="color: #7c3aed; font-size: 20px; font-weight: 700; margin: 0;">${totalDisplayText}</p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">${subs.length} serviço${subs.length !== 1 ? 's' : ''}</p>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                                Relatório gerado automaticamente em ${dataHoje}
                            </p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: fileName,
                            content: buffer,
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
        } else {
            // PDF Export
            const htmlTemplate = generateReportHtml(
                userName,
                userEmail,
                subs,
                totalDisplayHtml,
                dataHoje
            )

            // Gera o PDF usando Puppeteer
            const pdfBuffer = await generatePdfBuffer(htmlTemplate)
            const fileName = `Kovr-Relatorio-${dataHoje.replace(/\//g, '-')}.pdf`

            if (channel === 'telegram') {
                const formData = new FormData()
                formData.append('chat_id', profile.telegram_chat_id)

                const caption = `📊 <b>Relatório Financeiro Kovr</b>\n\n` +
                    `👤 ${userName}\n` +
                    `📅 ${dataHoje}\n\n` +
                    `💰 <b>Totais Estimados:</b>\n${totalDisplayText}\n\n` +
                    `📎 <i>PDF profissional em anexo</i>`

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
                    throw new Error(data.description || 'Erro ao enviar para Telegram')
                }

                return NextResponse.json({ success: true })
            } else {
                // Email PDF
                const emailRes = await resend.emails.send({
                    from: 'Kovr <noreply@kovr.space>',
                    to: userEmail,
                    subject: `📊 Relatório PDF - ${dataHoje}`,
                    html: `
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                            <div style="text-align: center; margin-bottom: 32px;">
                                <h1 style="font-size: 28px; font-weight: 800; color: #0f0f11; margin: 0;">Kovr<span style="color: #7c3aed;">.</span></h1>
                            </div>
                            <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">Olá, ${userName}!</h2>
                            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                Seu relatório de assinaturas está em anexo. Abrindo o arquivo <strong>PDF</strong>, você terá um resumo profissional de todos os seus serviços.
                            </p>
                            <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Resumo:</p>
                                <p style="color: #7c3aed; font-size: 20px; font-weight: 700; margin: 0;">${totalDisplayText}</p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">${subs.length} serviço${subs.length !== 1 ? 's' : ''}</p>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                                Relatório gerado automaticamente em ${dataHoje}
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
        console.error('Erro na exportação:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

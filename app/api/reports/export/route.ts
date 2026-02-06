import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = new Resend(RESEND_API_KEY)

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

        let fileContent = ''
        let fileName = ''
        let mimeType = ''

        // 4. Generate file content
        if (format === 'csv') {
            const header = 'Nome,Preço,Moeda,Ciclo,Categoria,Início,Próx. Renovação\n'
            const rows = subs.map(sub => {
                const inicio = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : '-'
                const renovacao = sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString('pt-BR') : '-'
                return `"${sub.name}",${sub.amount},${sub.currency},${sub.billing_type || sub.billing_cycle},${sub.category},${inicio},${renovacao}`
            }).join('\n')

            fileContent = header + rows
            fileName = `kovr_relatorio_${Date.now()}.csv`
            mimeType = 'text/csv'
        } else {
            // PDF (HTML format)
            fileName = `kovr_resumo_${Date.now()}.html`
            mimeType = 'text/html'

            fileContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Kovr</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6 font-sans">
  <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
    
    <div class="bg-[#0F0F11] p-8 text-white flex justify-between items-center border-b-4 border-purple-600">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Kovr<span class="text-purple-500">.</span></h1>
        <p class="text-gray-400 text-sm mt-1">Extrato de Assinaturas</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-400">Data de Emissão</p>
        <p class="font-mono font-bold text-lg">${dataHoje}</p>
      </div>
    </div>

    <div class="p-8 bg-purple-50/50 flex justify-between items-center border-b border-gray-100">
      <div>
        <p class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Assinante</p>
        <h2 class="text-xl font-bold text-gray-900">${userName}</h2>
        <p class="text-gray-600 text-sm">${userEmail}</p>
      </div>
      <div class="text-right">
        <p class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Custo Mensal Total</p>
        <h2 class="text-2xl font-bold text-purple-700 leading-tight">${totalDisplayHtml}</h2>
        <p class="text-xs text-gray-400 mt-1">${subs.length} Serviços Ativos</p>
      </div>
    </div>

    <div class="p-8">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b">Serviço</th>
            <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b">Ciclo</th>
            <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b text-right">Próx. Pagamento</th>
            <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b text-right">Valor</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-600">
          ${subs.map(sub => `
            <tr class="group hover:bg-gray-50 transition-colors">
              <td class="py-4 border-b group-last:border-0 font-medium text-gray-900">
                ${sub.name}
                <span class="block text-xs text-gray-400 font-normal">${sub.category}</span>
              </td>
              <td class="py-4 border-b group-last:border-0 capitalize">${sub.billing_cycle || sub.billing_type}</td>
              <td class="py-4 border-b group-last:border-0 text-right font-mono text-purple-600">
                ${sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString('pt-BR') : '-'}
              </td>
              <td class="py-4 border-b group-last:border-0 text-right font-bold text-gray-900">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: sub.currency || 'BRL' }).format(Number(sub.amount) || 0)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="bg-gray-50 p-6 text-center text-xs text-gray-400 border-t border-gray-100">
      <p>Relatório gerado automaticamente via Kovr SaaS.</p>
    </div>
  </div>
</body>
</html>
            `
        }

        // 5. Send via chosen channel
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

            const fileBlob = new Blob([fileContent], { type: mimeType })
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
            // Send via email
            const buffer = Buffer.from(fileContent, 'utf-8')

            const emailRes = await resend.emails.send({
                from: 'Kovr <noreply@kovr.app>',
                to: userEmail,
                subject: `📊 Relatório ${format.toUpperCase()} - ${dataHoje}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #7c3aed;">Kovr - Relatório de Assinaturas</h2>
                        <p>Olá, <strong>${userName}</strong>!</p>
                        <p>Seu relatório no formato <strong>${format.toUpperCase()}</strong> está em anexo.</p>
                        <p><strong>Totais:</strong> ${totalDisplayText}</p>
                        <p><strong>Total de Serviços:</strong> ${subs.length}</p>
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #666;">Relatório gerado automaticamente em ${dataHoje}</p>
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

    } catch (error: any) {
        console.error('Erro na exportação:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

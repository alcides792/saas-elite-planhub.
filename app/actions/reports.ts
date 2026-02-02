'use server'
import { createClient } from '@/utils/supabase/server'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendExportToTelegram(format: 'csv' | 'pdf') {
  const supabase = await createClient()

  // 1. Busca Usuário e Perfil
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Usuário não logado" }

  const { data: profile } = await supabase
    .from('profiles')
    .select('telegram_chat_id, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile?.telegram_chat_id) {
    return { success: false, error: "Telegram não conectado." }
  }

  const userName = profile.full_name || user.user_metadata?.full_name || "Usuário Kovr"
  const userEmail = profile.email || user.email || ""

  // 2. Busca Assinaturas (Usando colunas reais: amount, billing_cycle, next_payment)
  const { data: subs, error: subsError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('next_payment', { ascending: true })

  if (subsError) {
    console.error('Erro ao buscar assinaturas:', subsError)
    return { success: false, error: "Erro ao buscar dados: " + subsError.message }
  }

  if (!subs || subs.length === 0) {
    return { success: false, error: "Nenhuma assinatura encontrada." }
  }

  // 3. Lógica de Totais por Moeda (Multi-Currency Support)
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

  // Formata os totais para exibição
  const formattedTotals = Object.entries(totalsByCurrency).map(([currency, value]) => {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(value)
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

  // --- CSV ---
  if (format === 'csv') {
    const header = 'Nome,Preço,Moeda,Ciclo,Categoria,Início,Próx. Renovação\n'
    const rows = subs.map(sub => {
      const inicio = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : '-'
      const renovacao = sub.next_payment ? new Date(sub.next_payment).toLocaleDateString('pt-BR') : '-'
      return `"${sub.name}",${sub.amount},${sub.currency},${sub.billing_cycle || sub.billing_type},${sub.category},${inicio},${renovacao}`
    }).join('\n')

    fileContent = header + rows
    fileName = `kovr_relatorio_${Date.now()}.csv`
    mimeType = 'text/csv'
  }

  // --- HTML (PDF Visual) ---
  else {
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
                    ${sub.next_payment ? new Date(sub.next_payment).toLocaleDateString('pt-BR') : '-'}
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

  // Envio Telegram
  try {
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
    if (!data.ok) throw new Error(data.description)

    return { success: true }
  } catch (error: any) {
    console.error('Erro Telegram:', error)
    return { success: false, error: "Erro no envio: " + error.message }
  }
}

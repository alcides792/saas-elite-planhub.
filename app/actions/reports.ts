'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

    // Nome e Email para o cabeçalho (Fallback se não tiver no perfil)
    const userName = profile.full_name || user.user_metadata?.full_name || "Usuário Kovr"
    const userEmail = profile.email || user.email || ""

    // 2. Busca Assinaturas com datas
    const { data: subs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('next_payment_date', { ascending: true })

    if (!subs || subs.length === 0) {
        return { success: false, error: "Nenhuma assinatura encontrada." }
    }

    // 3. Calcula Totais
    const totalMensal = subs.reduce((acc, sub) => acc + Number(sub.price), 0)
    const dataHoje = new Date().toLocaleDateString('pt-BR')

    let fileContent = ''
    let fileName = ''
    let mimeType = ''

    // --- GERADOR DE CSV ---
    if (format === 'csv') {
        const header = 'Nome,Preço,Moeda,Ciclo,Categoria,Início,Próx. Renovação\n'
        const rows = subs.map(sub => {
            const inicio = sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : '-'
            const renovacao = sub.next_payment_date ? new Date(sub.next_payment_date).toLocaleDateString('pt-BR') : '-'
            return `"${sub.name}",${sub.price},${sub.currency},${sub.cycle},${sub.category},${inicio},${renovacao}`
        }).join('\n')

        fileContent = header + rows
        fileName = `kovr_relatorio_${Date.now()}.csv`
        mimeType = 'text/csv'
    }

    // --- GERADOR DE HTML (O "PDF" Visual) ---
    else {
        fileName = `kovr_resumo_${Date.now()}.html`
        mimeType = 'text/html'

        // Template HTML com Tailwind CSS (CDN) para ficar bonito
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
        
        <div class="bg-[#1a1a1a] p-8 text-white flex justify-between items-center border-b-4 border-purple-500">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Kovr<span class="text-purple-500">.</span></h1>
            <p class="text-gray-400 text-sm mt-1">Gestão Inteligente de Assinaturas</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-400">Relatório Gerado em</p>
            <p class="font-mono font-bold text-lg">${dataHoje}</p>
          </div>
        </div>

        <div class="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between">
          <div>
            <p class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Cliente</p>
            <h2 class="text-xl font-bold text-gray-800">${userName}</h2>
            <p class="text-gray-600">${userEmail}</p>
          </div>
          <div class="text-right">
            <p class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Custo Mensal Estimado</p>
            <h2 class="text-2xl font-bold text-purple-600">R$ ${totalMensal.toFixed(2)}</h2>
            <p class="text-sm text-gray-500">${subs.length} Assinaturas Ativas</p>
          </div>
        </div>

        <div class="p-8">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b">Serviço</th>
                <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b">Categoria</th>
                <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b">Ciclo</th>
                <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b text-right">Renovação</th>
                <th class="text-xs font-bold text-gray-400 uppercase tracking-wider py-3 border-b text-right">Valor</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-600">
              ${subs.map(sub => `
                <tr class="group hover:bg-purple-50 transition-colors">
                  <td class="py-4 border-b group-last:border-0 font-medium text-gray-900">${sub.name}</td>
                  <td class="py-4 border-b group-last:border-0">
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">${sub.category}</span>
                  </td>
                  <td class="py-4 border-b group-last:border-0 capitalize">${sub.cycle}</td>
                  <td class="py-4 border-b group-last:border-0 text-right font-mono text-purple-600">
                    ${sub.next_payment_date ? new Date(sub.next_payment_date).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td class="py-4 border-b group-last:border-0 text-right font-bold text-gray-900">
                    ${sub.currency} ${sub.price}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="bg-gray-50 p-6 text-center text-xs text-gray-400">
          <p>Este relatório foi gerado automaticamente pelo sistema Kovr.</p>
          <p class="mt-1">kovr.vercel.app</p>
        </div>
      </div>
    </body>
    </html>
    `
    }

    // 4. Envia para o Telegram
    try {
        const formData = new FormData()
        formData.append('chat_id', profile.telegram_chat_id)

        // Legenda Bonita
        const caption = `📊 <b>Seu Relatório Kovr Chegou!</b>\n\n` +
            `👤 <b>Usuário:</b> ${userName}\n` +
            `📅 <b>Data:</b> ${dataHoje}\n` +
            `💰 <b>Total Mensal:</b> R$ ${totalMensal.toFixed(2)}\n\n` +
            `<i>Abra o arquivo abaixo para ver os detalhes completos.</i>`

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
        console.error('Erro no Envio:', error)
        return { success: false, error: "Erro ao enviar arquivo: " + error.message }
    }
}

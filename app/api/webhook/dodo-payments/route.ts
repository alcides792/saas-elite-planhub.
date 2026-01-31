import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 1. Inicializa o Supabase com PODER MÁXIMO (Service Role)
// Isso permite encontrar e editar o usuário apenas pelo email
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        // Lê o JSON que o Dodo enviou
        const body = await request.json()

        // Extrai os campos baseados na sua pesquisa
        const { type, data } = body

        console.log(`🔔 Webhook Dodo Recebido: [${type}]`)

        // Verifica se é um evento de Assinatura Ativa ou Pagamento Sucesso
        if (type === 'subscription.active' || type === 'payment.succeeded') {

            // Mapeamento exato conforme a documentação que você trouxe
            const customerEmail = data.customer?.email
            const subscriptionId = data.subscription_id
            const status = data.status || 'active'

            // Lógica Inteligente para Trial:
            // Se vier "trial_period_days" no JSON, calculamos a data final
            let trialEnd = null;
            if (data.trial_period_days && data.trial_period_days > 0) {
                const hoje = new Date();
                hoje.setDate(hoje.getDate() + data.trial_period_days); // Soma os dias
                trialEnd = hoje.toISOString();
            }

            if (customerEmail) {
                console.log(`👤 Processando usuário: ${customerEmail}`)

                // Atualiza o perfil no Supabase
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        billing_status: trialEnd ? 'trialing' : 'active', // Se tem data de trial, marca como trialing
                        dodo_subscription_id: subscriptionId,
                        trial_ends_at: trialEnd, // Salva a data que o trial acaba
                        plan_name: 'Pro' // Ou pegue de data.product_id se quiser mapear nomes
                    })
                    .eq('email', customerEmail)

                if (error) {
                    console.error('❌ Erro ao salvar no banco:', error)
                    return NextResponse.json({ error: 'Erro de Banco de Dados' }, { status: 500 })
                }

                console.log(`✅ Sucesso! Usuário ${customerEmail} atualizado.`)
            } else {
                console.warn('⚠️ Email não encontrado no JSON do Dodo.')
            }
        }

        // Evento de Cancelamento
        if (type === 'subscription.cancelled' || type === 'subscription.failed') {
            const customerEmail = data.customer?.email
            if (customerEmail) {
                await supabase
                    .from('profiles')
                    .update({ billing_status: 'canceled' })
                    .eq('email', customerEmail)
                console.log(`🚫 Assinatura de ${customerEmail} cancelada.`)
            }
        }

        // Retorna 200 para o Dodo saber que recebemos
        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error('🔥 Erro Fatal no Webhook:', error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

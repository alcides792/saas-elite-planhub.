import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CancelButton from './CancelButton'
import SubscribeButton from './SubscribeButton'

export default async function BillingPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Busca os dados atualizados do perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Lógica de Estado
    const isPro = profile?.billing_status === 'active' || profile?.billing_status === 'trialing'
    const isTrial = profile?.billing_status === 'trialing'

    // Formata data amigável
    const endDate = profile?.trial_ends_at
        ? new Date(profile.trial_ends_at).toLocaleDateString('pt-BR')
        : 'Vitalício / Indefinido'

    return (
        <div className="max-w-5xl mx-auto p-6 text-white space-y-8">

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assinatura & Plano 💎</h1>
                    <p className="text-zinc-400 mt-1">Gerencie seus pagamentos e status da conta.</p>
                </div>
            </div>

            {isPro ? (
                // --- ESTADO 1: USUÁRIO PAGANTE (VISÃO PREMIUM) ---
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* O Cartão Virtual */}
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative h-64 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl">

                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                            {/* Card Header */}
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                                        PLANHUB <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PRO</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-widest uppercase">Member Card</p>
                                </div>
                                {isTrial && (
                                    <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                        <span className="text-yellow-400 text-xs font-bold animate-pulse">⚡ TRIAL ATIVO</span>
                                    </div>
                                )}
                            </div>

                            {/* Card User Info */}
                            <div className="z-10">
                                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Titular</p>
                                <p className="text-lg font-medium text-zinc-200 font-mono truncate">{profile.email}</p>
                            </div>

                            {/* Card Footer */}
                            <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
                                <div>
                                    <p className="text-zinc-500 text-xs mb-1">Validade / Renovação</p>
                                    <p className="text-sm text-white font-mono">{endDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-500 text-xs mb-1">Status</p>
                                    <p className="text-green-400 font-bold text-sm flex items-center justify-end gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        ATIVO
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área de Gerenciamento / Cancelamento */}
                    <div className="flex flex-col justify-center space-y-6 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Detalhes do Plano</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Acesso ilimitado a todas as ferramentas
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Suporte prioritário 24/7
                                </li>
                                {isTrial && (
                                    <li className="flex items-center gap-2 text-yellow-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Seu período de teste acaba em breve.
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-zinc-800">
                            <CancelButton subscriptionId={profile.dodo_subscription_id} />
                            <p className="mt-3 text-xs text-zinc-600 text-center">
                                Ao cancelar, você perde acesso aos recursos Pro imediatamente.
                            </p>
                        </div>
                    </div>
                </div>

            ) : (
                // --- ESTADO 2: NÃO ASSINANTE (OFERTA) ---
                <div className="max-w-md mx-auto mt-8">
                    {/* Card Estilo "Pro" Roxo Vibrante */}
                    <div className="relative rounded-3xl overflow-hidden bg-purple-600 text-white shadow-2xl p-8">

                        {/* Badge POPULAR */}
                        <div className="absolute top-6 right-6 bg-black/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            POPULAR
                        </div>

                        {/* Título */}
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>

                        {/* Preço */}
                        <div className="flex items-baseline mb-8">
                            <span className="text-5xl font-extrabold tracking-tight">$27</span>
                            <span className="text-purple-200 text-xl ml-2 font-medium">/lifetime</span>
                        </div>

                        {/* Lista de Benefícios com Checkmarks */}
                        <ul className="space-y-4 mb-8">
                            {[
                                "Unlimited subscriptions",
                                "Advanced analytics",
                                "Bill splitting",
                                "Priority support",
                                "AI chat (50 credits)",
                                "Export data",
                                "Early access to new features"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    {/* Ícone de Checkmark (✓) */}
                                    <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Botão de Compra (Estilo Preto) */}
                        <div className="mt-8">
                            <SubscribeButton />
                        </div>

                        <p className="text-center text-purple-200 text-xs mt-4 font-medium">
                            One-time payment. Secure checkout via Dodo.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

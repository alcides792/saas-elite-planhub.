import { createClient } from '@/lib/utils/supabase/server'
export const dynamic = 'force-dynamic';
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

    // Format friendly date
    const endDate = profile?.trial_ends_at
        ? new Date(profile.trial_ends_at).toLocaleDateString('en-US')
        : 'Lifetime / Indefinite'

    return (
        <div className="max-w-5xl mx-auto p-6 text-white space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#222] pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Subscription & Plan</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your payments and account status.</p>
                </div>
            </div>

            {isPro ? (
                // --- STATE 1: PAYING USER (PREMIUM VIEW) ---
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* The Virtual Card */}
                    <div className="relative group">
                        <div className="relative h-64 bg-gray-900 dark:bg-black border border-gray-700 dark:border-[#333] rounded-xl p-8 flex flex-col justify-between overflow-hidden shadow-sm">
                            
                            {/* Card Header */}
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-[0.2em] flex items-center gap-2">
                                        KOVR <span className="text-zinc-400">PRO</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-widest uppercase">Member Card</p>
                                </div>
                                {isTrial && (
                                    <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        Trial
                                    </div>
                                )}
                            </div>

                            {/* Card User Info */}
                            <div className="z-10">
                                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Holder</p>
                                <p className="text-lg font-medium text-white font-mono truncate uppercase">{user?.email}</p>
                            </div>

                            {/* Card Footer */}
                            <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
                                <div>
                                    <p className="text-zinc-500 text-[10px] mb-1 uppercase tracking-widest">Validity / Renewal</p>
                                    <p className="text-sm text-white font-mono">{endDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-500 text-[10px] mb-1 uppercase tracking-widest">Status</p>
                                    <p className="text-white font-bold text-sm tracking-widest uppercase">
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Management / Cancellation Area */}
                    <div className="flex flex-col justify-center space-y-6 p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl shadow-sm dark:shadow-none">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Plan Details</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
                                    <span>Unlimited access to all tools</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
                                    <span>24/7 priority support</span>
                                </li>
                                {isTrial && (
                                    <li className="flex items-center gap-3 text-sm text-amber-600 dark:text-amber-500 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500" />
                                        <span>Your trial period ends soon.</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-[#222]">
                            <CancelButton subscriptionId={profile?.dodo_subscription_id} />
                            <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                                Instant cancellation. Access lost immediately.
                            </p>
                        </div>
                    </div>
                </div>

            ) : (
                // --- STATE 2: NON-SUBSCRIBER (OFFER) ---
                <div className="max-w-md mx-auto mt-8 dark">
                    {/* Vibrant Pro Card focused on Trial */}
                    <div className="relative rounded-3xl overflow-hidden bg-gray-900 dark:bg-black text-white shadow-2xl p-10 border border-gray-800 dark:border-white/10">

                        {/* Trial Badge */}
                        <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest shadow-lg">
                            ⚡ 3 Days Free
                        </div>

                        {/* Title and Call to Action */}
                        <div className="mt-2 mb-6">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">PRO PLAN</h3>
                            <h2 className="text-4xl font-bold tracking-tight uppercase text-white">Try risk-free</h2>
                        </div>

                        {/* Price with explanation */}
                        <div className="flex items-baseline mb-2">
                            <span className="text-5xl font-extrabold tracking-tight text-white">$27</span>
                            <span className="text-zinc-400 text-lg ml-2 font-medium">/year</span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-8 font-medium bg-white/5 inline-block px-3 py-1 rounded-md border border-white/5 uppercase tracking-widest">
                            3-day trial included
                        </p>

                        {/* Benefits List */}
                        <ul className="space-y-4 mb-10">
                            {[
                                "Unlimited subscriptions",
                                "Advanced analytics",
                                "Bill splitting",
                                "Priority support",
                                "AI chat (50 credits)",
                                "Export data",
                                "Early access"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1fe2c3] shadow-[0_0_8px_#1fe2c3]" />
                                    <span className="text-sm font-medium tracking-tight text-zinc-200">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Action Button */}
                        <div className="mt-4">
                            <SubscribeButton />
                        </div>

                        <p className="text-center text-zinc-500 text-[10px] mt-6 uppercase tracking-widest">
                            Cancel anytime. Secure payment by Dodo.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

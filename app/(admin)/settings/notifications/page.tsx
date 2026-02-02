'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { getProfile } from '@/app/actions/settings'
import NotificationChannels from '@/components/settings/NotificationChannels'

export default function NotificationsSettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadProfile() {
            const res = await getProfile()
            if (res.success) {
                setProfile(res.profile)
            }
            setIsLoading(false)
        }
        loadProfile()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Carregando Configurações...</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-12">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    VOLTAR PARA CONFIGURAÇÕES
                </Link>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-1 bg-purple-500 rounded-full" />
                    <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[11px]">Centro de Alertas</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                    Sistema de <span className="text-zinc-800">Notificações</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl font-medium leading-relaxed">
                    Configure onde você deseja receber avisos sobre renovações, relatórios semanais e insights de gastos do Kovr AI.
                </p>
            </motion.div>

            {/* Security Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10 p-6 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-[2rem] flex items-center gap-6"
            >
                <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                        Privacidade Garantida
                        <Zap size={14} className="text-yellow-500" />
                    </h4>
                    <p className="text-sm text-zinc-400">Suas chaves de webhook e IDs são criptografados e usados apenas para o envio de alertas automáticos.</p>
                </div>
            </motion.div>

            {/* Channels Grid */}
            <NotificationChannels
                userId={profile?.id}
                initialTelegramId={profile?.telegram_chat_id}
                initialDiscordWebhook={profile?.discord_webhook}
            />

            <div className="mt-12 p-8 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-zinc-500">
                        <Bell size={20} />
                        <span className="text-xs font-medium tracking-wide">As notificações por e-mail continuam ativas nas <Link href="/settings" className="text-purple-400 hover:underline">Configurações Gerais</Link>.</span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Kovr v2.0 • Sistema de Alertas</p>
                </div>
            </div>

            <style jsx global>{`
        .plan-hub-card {
           background: rgba(18, 18, 18, 0.4);
           backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 2.5rem;
        }
        .plan-hub-input {
           background: rgba(0, 0, 0, 0.2);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 1.25rem;
           padding: 1rem 1.25rem;
           color: white;
           font-size: 0.875rem;
           width: 100%;
           transition: all 0.3s;
        }
        .plan-hub-input:focus {
           outline: none;
           border-color: rgba(139, 92, 246, 0.5);
           background: rgba(0, 0, 0, 0.4);
        }
      `}</style>
        </div>
    )
}

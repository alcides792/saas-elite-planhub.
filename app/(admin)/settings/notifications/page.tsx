'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, ArrowLeft, Smartphone, ShieldCheck, Zap } from 'lucide-react'
import { TelegramIcon, DiscordIcon } from '@/components/icons/BrandIcons'
import Link from 'next/link'
import { getProfile } from '@/app/actions/settings'
import TelegramConnect from '@/components/settings/TelegramConnect'
import ComingSoonCard from '@/components/settings/ComingSoonCard'

export default function NotificationsPage() {
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
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            {/* Cabeçalho */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold group mb-8"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    VOLTAR PARA CONFIGURAÇÕES
                </Link>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-1 bg-purple-500 rounded-full" />
                    <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[11px]">Centro de Alertas</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Canais de Alerta</h1>
                <p className="text-zinc-500 font-medium">
                    Escolha onde você quer ser avisado antes de uma assinatura renovar.
                </p>
            </motion.div>

            {/* Destaque: Telegram (Funcional) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-purple-500/20 rounded-[2.5rem] p-1 bg-gradient-to-b from-purple-500/10 to-transparent overflow-hidden"
            >
                <div className="bg-zinc-950/40 backdrop-blur-3xl p-8 rounded-[2.3rem]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                            <TelegramIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Telegram Instantâneo</h2>
                            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Recomendado</p>
                        </div>
                    </div>

                    <TelegramConnect
                        userId={profile?.id}
                        isActive={!!profile?.telegram_chat_id}
                        onConnected={() => setProfile({ ...profile, telegram_chat_id: 'connected' })}
                    />
                </div>
            </motion.div>

            {/* Outras Opções (Bloqueadas) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
            >
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] pl-2">
                    Outros Canais (Roadmap)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <ComingSoonCard
                        icon={DiscordIcon}
                        title="Discord Webhooks"
                        description="Receba alertas e logs diretamente no seu servidor."
                        color="#5865F2"
                    />

                    <ComingSoonCard
                        icon={Smartphone}
                        title="App Kovr Oficial"
                        description="Notificações Push Nativas para iOS e Android."
                        color="#10b981"
                    />
                </div>
            </motion.div>

            {/* Footer Info */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-zinc-500">
                    <Bell size={18} />
                    <span className="text-[11px] font-medium tracking-wide">
                        Alertas por e-mail continuam ativos nas <Link href="/settings" className="text-purple-400 hover:underline">Configurações Gerais</Link>.
                    </span>
                </div>
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Kovr v2.0 • Alertas Inteligentes</p>
            </div>
        </div>
    )
}

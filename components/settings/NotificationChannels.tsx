'use client'

import { useState } from 'react'
import { Send, MessageSquare, CheckCircle2, Loader2, ExternalLink, BellRing } from 'lucide-react'
import { motion } from 'framer-motion'
import { saveTelegramId, saveDiscordWebhook } from '@/app/actions/notifications'

interface NotificationChannelsProps {
    initialTelegramId?: string | null
    initialDiscordWebhook?: string | null
}

export default function NotificationChannels({
    initialTelegramId,
    initialDiscordWebhook
}: NotificationChannelsProps) {
    const [telegramId, setTelegramId] = useState('')
    const [discordWebhook, setDiscordWebhook] = useState('')
    const [activeTelegram, setActiveTelegram] = useState(!!initialTelegramId)
    const [activeDiscord, setActiveDiscord] = useState(!!initialDiscordWebhook)
    const [isLoading, setIsLoading] = useState({ telegram: false, discord: false })
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleConnectTelegram = async () => {
        if (!telegramId) return
        setIsLoading(prev => ({ ...prev, telegram: true }))
        const res = await saveTelegramId(telegramId)
        if (res.success) {
            setActiveTelegram(true)
            setMessage({ type: 'success', text: 'Telegram conectado!' })
        } else {
            setMessage({ type: 'error', text: res.error || 'Erro ao conectar' })
        }
        setIsLoading(prev => ({ ...prev, telegram: false }))
    }

    const handleConnectDiscord = async () => {
        if (!discordWebhook) return
        setIsLoading(prev => ({ ...prev, discord: true }))
        const res = await saveDiscordWebhook(discordWebhook)
        if (res.success) {
            setActiveDiscord(true)
            setMessage({ type: 'success', text: 'Discord conectado!' })
        } else {
            setMessage({ type: 'error', text: res.error || 'Erro ao conectar' })
        }
        setIsLoading(prev => ({ ...prev, discord: false }))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            {/* Telegram Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="plan-hub-card p-8 group relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <Send size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Telegram</h3>
                            <p className="text-sm text-zinc-500 font-medium">Alertas instantâneos</p>
                        </div>
                    </div>
                    {activeTelegram && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ativo</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        1. Envie uma mensagem para o <a href="https://t.me/userinfobot" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">@userinfobot <ExternalLink size={10} /></a> no Telegram.<br />
                        2. Copie seu <strong>ID de Usuário</strong> e cole abaixo.
                    </p>

                    {!activeTelegram ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ex: 12345678"
                                value={telegramId}
                                onChange={(e) => setTelegramId(e.target.value)}
                                className="w-full plan-hub-input"
                            />
                            <button
                                onClick={handleConnectTelegram}
                                disabled={isLoading.telegram}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading.telegram ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                CONECTAR TELEGRAM
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl">
                            <p className="text-[11px] text-zinc-500 text-center">Conectado com sucesso. Você receberá alertas automáticos aqui.</p>
                            <button
                                onClick={() => setActiveTelegram(false)}
                                className="w-full mt-4 text-[10px] font-bold text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                                Alterar Conexão
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Discord Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="plan-hub-card p-8 group relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                            <MessageSquare size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Discord</h3>
                            <p className="text-sm text-zinc-500 font-medium">Webhooks de canal</p>
                        </div>
                    </div>
                    {activeDiscord && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ativo</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        1. Vá nas <strong>Configurações do Canal</strong> &gt; <strong>Integrações</strong>.<br />
                        2. Crie um <strong>Webhook</strong>, copie a URL e cole abaixo.
                    </p>

                    {!activeDiscord ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="https://discord.com/api/webhooks/..."
                                value={discordWebhook}
                                onChange={(e) => setDiscordWebhook(e.target.value)}
                                className="w-full plan-hub-input"
                            />
                            <button
                                onClick={handleConnectDiscord}
                                disabled={isLoading.discord}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading.discord ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                                CONECTAR DISCORD
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl">
                            <p className="text-[11px] text-zinc-500 text-center">Webhook configurado. Os logs de renovação serão enviados para o seu canal.</p>
                            <button
                                onClick={() => setActiveDiscord(false)}
                                className="w-full mt-4 text-[10px] font-bold text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                                Alterar Conexão
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Toast Notification */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`col-span-1 md:col-span-2 flex items-center gap-3 p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                >
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <div className="w-4.5 h-4.5 rounded-full bg-red-500" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto text-[10px] font-black opacity-50 hover:opacity-100">FECHAR</button>
                </motion.div>
            )}
        </div>
    )
}

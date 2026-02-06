'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, RefreshCw, ExternalLink, Send } from 'lucide-react'

export default function TelegramConnect() {
    const [userId, setUserId] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // --- CORREÇÃO FINAL E FORÇADA ---
    // Forçamos o username correto aqui para evitar problemas de cache/env
    const BOT_USERNAME = "KovrAppBot"

    useEffect(() => {
        checkConnection()
    }, [])

    async function checkConnection() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUserId(user.id)
            const { data } = await supabase.from('profiles').select('telegram_chat_id').eq('id', user.id).single()
            if (data?.telegram_chat_id) setIsConnected(true)
        }
        setLoading(false)
    }

    return (
        <div className="relative group overflow-hidden h-full">
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 relative shrink-0">
                    <Image src="/icons/telegram-3d-v2.png" alt="Telegram" fill className="object-contain" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Telegram</h3>
                    <p className="text-zinc-400 text-sm">Conexão instantânea em 1 clique.</p>
                </div>
            </div>

            {!isConnected ? (
                <div className="space-y-5 relative z-10">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Receba alertas de vencimento direto no seu celular.
                            Basta clicar abaixo e iniciar o bot <strong>@{BOT_USERNAME}</strong>.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Link Gerado Dinamicamente - FORÇADO KovrAppBot */}
                        <a
                            href={`https://t.me/${BOT_USERNAME}?start=${userId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-[#229ED9] hover:bg-[#1e8ubc] text-white font-bold text-lg rounded-xl transition shadow-xl shadow-[#229ED9]/20 hover:scale-[1.02]"
                        >
                            <Send size={20} />
                            Conectar @{BOT_USERNAME} Agora
                            <ExternalLink size={16} className="opacity-50" />
                        </a>

                        <button
                            onClick={checkConnection}
                            className="text-xs text-zinc-500 hover:text-white flex items-center justify-center gap-2 mt-2 transition"
                        >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                            Já iniciei o bot, verificar conexão
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl flex items-center gap-4 relative z-10 animate-in fade-in zoom-in">
                    <div className="bg-green-500/20 p-2 rounded-full">
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <div>
                        <p className="text-green-400 font-bold text-lg">Conectado!</p>
                        <p className="text-green-500/60 text-sm">Bot <strong>@{BOT_USERNAME}</strong> ativo.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

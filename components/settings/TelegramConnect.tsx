'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
import { TelegramIcon } from '@/components/icons/BrandIcons'
import { motion } from 'framer-motion'
import { getProfile } from '@/app/actions/settings'

interface TelegramConnectProps {
    userId: string
    onConnected: () => void
    isActive: boolean
}

export default function TelegramConnect({ userId, onConnected, isActive }: TelegramConnectProps) {
    const [isChecking, setIsChecking] = useState(false)

    // Substitua 'KovrBot' pelo username real do seu bot
    const botUsername = 'KovrBot'
    const telegramLink = `https://t.me/${botUsername}?start=${userId}`

    const checkStatus = async () => {
        setIsChecking(true)
        const res = await getProfile()
        if (res.success && res.profile?.telegram_chat_id) {
            onConnected()
        }
        setIsChecking(false)
    }

    return (
        <div className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
                Clique no botão abaixo para abrir o nosso bot e dê <strong>/start</strong>.
                O sistema identificará sua conta automaticamente.
            </p>

            {!isActive ? (
                <div className="space-y-4">
                    <a
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-white/5"
                    >
                        <TelegramIcon size={18} />
                        ABRIR NO TELEGRAM
                        <ExternalLink size={14} className="opacity-50" />
                    </a>

                    <button
                        onClick={checkStatus}
                        disabled={isChecking}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 border border-white/5 text-zinc-400 py-3 rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all disabled:opacity-50"
                    >
                        {isChecking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        VERIFICAR CONEXÃO
                    </button>
                </div>
            ) : (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
                        <CheckCircle2 size={14} />
                        Conta Vinculada
                    </div>
                    <p className="text-[10px] text-zinc-500">Seu Telegram foi configurado com sucesso via Deep Linking.</p>
                </div>
            )}
        </div>
    )
}

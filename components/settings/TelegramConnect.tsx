'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/utils/supabase/client'
import { Loader2 } from 'lucide-react'

export default function TelegramConnect() {
    const [userId, setUserId] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // --- FINAL FORCED FIX ---
    // We force the correct username here to avoid cache/env issues
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
        <div className="h-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-300 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-white/5 rounded-lg flex items-center justify-center relative shrink-0">
                        <Image src="/icons/telegram-3d-v2.png" alt="Telegram" fill className="object-contain p-2" />
                    </div>
                    {isConnected ? (
                        <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                            ACTIVE
                        </div>
                    ) : (
                        <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                            AVAILABLE
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">Telegram</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Direct alerts via Kovr Bot.</p>
                </div>
            </div>

            <div className="mt-6">
                {!isConnected ? (
                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://t.me/${BOT_USERNAME}?start=${userId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-gray-900 text-white dark:bg-white dark:text-black font-medium rounded-md text-center text-sm hover:opacity-90 transition-opacity"
                        >
                            Connect Telegram
                        </a>
                    </div>
                ) : (
                    <button
                        className="w-full py-2 bg-transparent border border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-white/5 font-medium rounded-md text-center text-xs text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        Configure
                    </button>
                )}
            </div>
        </div>
    )
}

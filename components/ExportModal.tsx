'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (channel: 'email' | 'telegram') => void
    type: 'PDF' | 'CSV' | null
    isLoading: boolean
}

export default function ExportModal({ isOpen, onClose, onSelect, type, isLoading }: ExportModalProps) {
    if (!type) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative w-full max-w-lg bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 z-10"
                            >
                                <X size={20} className="text-white" />
                            </button>

                            {/* Header */}
                            <div className="p-8 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 relative">
                                        <Image
                                            src={type === 'PDF' ? '/icons/pdf-3d.png' : '/icons/csv-3d.png'}
                                            alt={type}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">
                                            Exportar Relatório {type}
                                        </h2>
                                        <p className="text-sm text-zinc-400 mt-0.5">
                                            Escolha onde deseja receber o seu arquivo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="p-8 grid grid-cols-2 gap-4">
                                {/* Telegram Option */}
                                <motion.button
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    onClick={() => onSelect('telegram')}
                                    disabled={isLoading}
                                    className="group relative p-6 bg-gradient-to-br from-[#229ED9]/20 to-[#229ED9]/5 border border-[#229ED9]/30 rounded-2xl hover:border-[#229ED9]/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#229ED9]/0 to-[#229ED9]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 relative shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <Image
                                                src="/icons/telegram-3d-v2.png"
                                                alt="Telegram"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white mb-1">Telegram</p>
                                            <p className="text-xs text-zinc-400">Enviar para Bot</p>
                                        </div>

                                        {isLoading && (
                                            <Loader2 size={20} className="animate-spin text-[#229ED9]" />
                                        )}
                                    </div>
                                </motion.button>

                                {/* Email Option */}
                                <motion.button
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    onClick={() => onSelect('email')}
                                    disabled={isLoading}
                                    className="group relative p-6 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-2xl hover:border-purple-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 relative shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <Image
                                                src="/icons/gmail-3d.png"
                                                alt="Email"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white mb-1">E-mail</p>
                                            <p className="text-xs text-zinc-400">Enviar por E-mail</p>
                                        </div>

                                        {isLoading && (
                                            <Loader2 size={20} className="animate-spin text-purple-500" />
                                        )}
                                    </div>
                                </motion.button>
                            </div>

                            {/* Footer Hint */}
                            <div className="px-8 pb-8">
                                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-zinc-500">
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={14} className="animate-spin" />
                                                Processando exportação...
                                            </span>
                                        ) : (
                                            'O arquivo será enviado instantaneamente para o canal escolhido.'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

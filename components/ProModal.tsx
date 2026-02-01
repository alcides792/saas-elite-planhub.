'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Zap } from 'lucide-react'

interface ProModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ProModal({ isOpen, onClose }: ProModalProps) {
    const router = useRouter()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#0F0F11] border border-purple-500/30 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-purple-900/20 overflow-hidden"
                    >
                        {/* Glossy background effect */}
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition p-1 hover:bg-white/5 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        {/* Highlight Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-3xl flex items-center justify-center border border-purple-500/40 shadow-inner group transition-transform duration-500 hover:rotate-6">
                                <Lock className="w-10 h-10 text-purple-400" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-white mb-3 tracking-tighter italic uppercase">Funcionalidade Exclusiva</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                Você atingiu o limite do seu plano atual. Para adicionar mais assinaturas e usar a <span className="text-white font-bold">IA Financeira</span>, você precisa de um plano ativo.
                            </p>
                        </div>

                        {/* Main Action Button */}
                        <button
                            onClick={() => {
                                onClose()
                                router.push('/dashboard/billing')
                            }}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                            <span>Começar Teste Grátis de 3 Dias</span>
                            <Zap size={18} className="fill-current text-yellow-300 animate-pulse" />
                        </button>

                        {/* Secondary Link */}
                        <button
                            onClick={onClose}
                            className="w-full mt-5 text-[10px] text-zinc-600 hover:text-zinc-400 font-black uppercase tracking-[0.2em] transition"
                        >
                            Não, obrigado. Quero continuar limitado.
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

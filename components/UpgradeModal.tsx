'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Zap } from 'lucide-react'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const router = useRouter()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0F0F11] border border-purple-500/30 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] relative overflow-hidden"
                    >
                        {/* Background Gradient Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />

                        {/* Botão Fechar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
                        >
                            <X size={20} />
                        </button>

                        {/* Ícone */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-purple-500/30 shadow-inner">
                            <Lock className="w-8 h-8 text-purple-400" />
                        </div>

                        <h3 className="text-2xl font-black text-white text-center mb-3 tracking-tight">Recurso Pro Bloqueado</h3>
                        <p className="text-zinc-400 text-sm text-center mb-8 leading-relaxed">
                            Você atingiu o limite do plano Grátis. Atualize para o Pro e desbloqueie <span className="text-white font-bold">assinaturas ilimitadas</span>, <span className="text-white font-bold">IA Financeira</span> e <span className="text-white font-bold">Tokens de API</span>.
                        </p>

                        <button
                            onClick={() => {
                                onClose()
                                router.push('/dashboard/billing')
                            }}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group"
                        >
                            <Zap size={18} className="fill-current text-yellow-300 group-hover:animate-pulse" />
                            Liberar Acesso Agora
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full mt-4 py-2 text-zinc-500 text-xs font-bold hover:text-zinc-300 transition-colors uppercase tracking-widest"
                        >
                            Talvez depois
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

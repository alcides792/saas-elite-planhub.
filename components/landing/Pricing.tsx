"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Assuma o controle.</h2>
                <p className="text-zinc-500 mb-16 text-lg">Escolha o plano que melhor se adapta ao seu bolso.</p>

                <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div {...fadeInUp} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] text-left flex flex-col">
                        <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Plano Grátis</span>
                        <div className="my-6">
                            <span className="text-5xl font-black text-white">Grátis</span>
                        </div>
                        <p className="text-zinc-400 mb-8 italic">Track 3 assinaturas grátis para sempre.</p>
                        <ul className="space-y-4 mb-10 text-zinc-400 flex-grow">
                            {["Até 3 Assinaturas", "Alertas no Telegram", "Dashboard Básico", "IA de Sugestões"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /><span>{f}</span></li>
                            ))}
                        </ul>
                        <button className="w-full bg-zinc-800 text-white py-4 rounded-xl font-bold hover:bg-zinc-700 transition-colors mt-auto">Começar Agora</button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="relative p-[2px] rounded-[2rem] bg-gradient-to-br from-purple-400 to-purple-800 shadow-2xl z-10 flex flex-col"
                    >
                        <div className="bg-zinc-950 rounded-[1.9rem] p-10 text-center text-white relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 bg-purple-600 px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase">Recomendado</div>
                            <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">Plano Pro</span>
                            <div className="my-6">
                                <span className="text-6xl font-black">$27</span>
                                <span className="text-purple-400 ml-2">/ ano</span>
                            </div>
                            <p className="text-zinc-300 mb-8 font-semibold italic">Ilimitado pelo preço de um café.</p>
                            <ul className="text-left space-y-4 mb-10 text-zinc-300 flex-grow">
                                {["Assinaturas Ilimitadas", "IA Generativa Avançada", "Alertas Inteligentes", "Suporte Prioritário", "Exportação de Dados"].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /><span>{f}</span></li>
                                ))}
                            </ul>
                            <motion.button whileHover={{ scale: 1.05 }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-purple-500 transition-colors mt-auto">Garantir Acesso ⚡</motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

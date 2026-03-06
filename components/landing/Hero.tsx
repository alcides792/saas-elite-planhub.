"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-6 py-2 mb-8 text-xs font-black text-[#1a1a1a] dark:text-[#1fe2c3] uppercase bg-[#1fe2c3]/10 border-2 border-[#1a1a1a] dark:border-[#1fe2c3] rounded-sm transform -rotate-1">
                        PARE DE PERDER DINHEIRO
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] dark:text-white mb-8 tracking-tighter leading-none">
                        NUNCA MAIS PAGUES <br className="hidden md:block" />
                        POR ASSINATURAS <br className="hidden md:block" />
                        <span className="bg-[#1fe2c3] text-[#1a1a1a] px-4 border-2 border-[#1a1a1a]">QUE NÃO USAS.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#1a1a1a]/80 dark:text-zinc-400 mb-12 font-medium leading-tight">
                        O Kovr centraliza todos os teus gastos mensais num único lugar e envia-te <span className="text-[#1a1a1a] dark:text-white font-bold underline decoration-4 decoration-[#1fe2c3] underline-offset-4">alertas inteligentes</span> antes de qualquer renovação.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-10 py-5 bg-[#1fe2c3] text-[#1a1a1a] font-black text-xl border-4 border-[#1a1a1a] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transition-all flex items-center justify-center gap-3 group"
                        >
                            Começar Agora
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-10 py-5 bg-white text-[#1a1a1a] font-black text-xl border-4 border-[#1a1a1a] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3"
                        >
                            Fazer Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

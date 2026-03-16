"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { trackClick } from "@/lib/utils/analytics-hits"

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
                        STOP LOSING MONEY
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] dark:text-white mb-8 tracking-tighter leading-none">
                        NEVER PAY <br className="hidden md:block" />
                        FOR SUBSCRIPTIONS <br className="hidden md:block" />
                        <span className="bg-[#1fe2c3] text-[#1a1a1a] px-4 border-2 border-[#1a1a1a]">YOU DON'T USE.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#1a1a1a]/80 dark:text-zinc-400 mb-12 font-medium leading-tight">
                        Kovr centralizes all your monthly expenses in one place and sends you <span className="text-[#1a1a1a] dark:text-white font-bold underline decoration-4 decoration-[#1fe2c3] underline-offset-4">smart alerts</span> before any renewal.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/login?mode=signup&plan=trial"
                            onClick={() => trackClick("/login?mode=signup&plan=trial")}
                            className="w-full sm:w-auto px-10 py-5 bg-[#1fe2c3] text-[#1a1a1a] font-black text-xl border-4 border-[#1a1a1a] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transition-all flex items-center justify-center gap-3 group"
                        >
                            Get Started Now
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => trackClick("/login")}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-[#1a1a1a] font-black text-xl border-4 border-[#1a1a1a] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

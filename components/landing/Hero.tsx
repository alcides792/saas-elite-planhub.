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
                <div>
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-purple-400 uppercase bg-purple-400/10 border border-purple-400/20 rounded-full">
                        Powered by Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
                        ALL YOUR RECURRING <br className="hidden md:block" />
                        PAYMENTS IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600">ONE PLACE</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                        Track renewals, receive alerts on Telegram, and use <span className="text-zinc-900 dark:text-white font-semibold">Artificial Intelligence</span> to optimize your spending. <span className="text-purple-600 dark:text-purple-500 font-bold underline decoration-purple-500/30 underline-offset-4">Never pay</span> for unused services again.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 group active:scale-95"
                        >
                            Start Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-bold rounded-2xl border border-zinc-200 dark:border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <Play size={18} className="fill-current" />
                            Learn More
                        </button>
                    </div>

                    {/* Trust badges/Social proof could go here */}
                    <div
                        className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale"
                    >
                        {/* Placeholder for logos or trust signals */}
                    </div>
                </div>
            </div>
        </section>
    )
}

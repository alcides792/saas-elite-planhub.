"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { trackClick } from "@/lib/utils/analytics-hits"

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
                <h2 className="text-4xl md:text-7xl font-black mb-6 text-[#1a1a1a] dark:text-white uppercase tracking-tighter">TAKE BACK CONTROL</h2>
                <p className="text-[#1a1a1a] font-bold italic mb-16 text-xl">CHOOSE THE PLAN THAT BEST FITS YOUR WALLET</p>

                <div className="flex justify-center items-stretch max-w-2xl mx-auto">
                    {/* Unique Pro Plan */}
                    <motion.div
                        {...fadeInUp}
                        className="bg-white dark:bg-zinc-900 border-4 border-[#1a1a1a] dark:border-white p-12 text-left flex flex-col shadow-[12px_12px_0px_#1fe2c3] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_#1fe2c3] transition-all relative overflow-hidden w-full"
                    >
                        <div className="absolute top-0 right-0 bg-[#faed27] px-6 py-2 text-xs font-black uppercase text-[#1a1a1a] border-l-4 border-b-4 border-[#1a1a1a] dark:border-white">
                            Most Popular
                        </div>
                        
                        <span className="text-white dark:text-[#1a1a1a] text-xs font-black uppercase tracking-widest bg-[#1a1a1a] dark:bg-white px-3 py-1 border-2 border-[#1a1a1a] dark:border-white self-start mb-6">
                            SINGLE PLAN
                        </span>

                        <div className="mb-6 border-b-4 border-slate-100 dark:border-zinc-800 pb-4">
                            <span className="text-7xl font-black text-[#1a1a1a] dark:text-white">$27</span>
                            <span className="text-slate-500 dark:text-zinc-500 ml-2 font-black text-xl italic">/ year</span>
                        </div>

                        <div className="flex flex-col gap-2 mb-8">
                            <div className="bg-[#1fe2c3] p-2 border-2 border-[#1a1a1a] dark:border-white inline-block self-start transform -rotate-1">
                                <p className="text-[#1a1a1a] font-black uppercase italic leading-none">3-DAY FREE TRIAL</p>
                            </div>
                            <p className="text-slate-600 dark:text-zinc-400 font-bold italic text-lg leading-snug">
                                Try everything with no commitment. Then just $2.25/month.
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10 text-[#1a1a1a] dark:text-zinc-300 font-bold flex-grow">
                            {[
                                "Unlimited Subscriptions",
                                "Advanced Generative AI",
                                "Smart Alerts (Telegram/Discord)",
                                "Premium Chrome Extension",
                                "1-Click Cancellation",
                                "Only pay if you love it"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#1fe2c3] stroke-[4px]" />
                                    <span className="uppercase text-sm tracking-tight">{f}</span>
                                </li>
                            ))}
                        </ul>

                        <Link 
                            href="/login?mode=signup&plan=trial"
                            onClick={() => trackClick("/login?mode=signup&plan=trial")}
                            className="w-full bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] py-6 border-4 border-[#1a1a1a] dark:border-white font-black text-2xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors mt-auto uppercase shadow-[6px_6px_0px_#1fe2c3] flex items-center justify-center group"
                        >
                            Start Free Trial <span className="ml-2 group-hover:translate-x-1 transition-transform">⚡</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { trackClick } from "@/components/AnalyticsTracker"

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
                        className="bg-[#1fe2c3] border-4 border-[#1a1a1a] p-12 text-left flex flex-col shadow-[12px_12px_0px_#1a1a1a] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_#1a1a1a] transition-all relative overflow-hidden w-full"
                    >
                        <div className="absolute top-0 right-0 bg-[#1a1a1a] px-6 py-2 text-xs font-black uppercase text-white border-l-4 border-b-4 border-[#1a1a1a]">Most Popular</div>
                        <span className="text-[#1a1a1a] text-xs font-black uppercase tracking-widest bg-white px-3 py-1 border-2 border-[#1a1a1a] self-start mb-6">SINGLE PLAN</span>
                        <div className="mb-6 border-b-4 border-[#1a1a1a] pb-4">
                            <span className="text-7xl font-black text-[#1a1a1a]">$27</span>
                            <span className="text-[#1a1a1a] ml-2 font-black text-xl">/ year</span>
                        </div>
                        <p className="text-[#1a1a1a] font-black mb-4 italic text-xl">3-DAY FREE TRIAL</p>
                        <p className="text-[#1a1a1a] font-bold mb-8 italic text-lg opacity-80">Try everything with no commitment. Then just $2.25/month (billed annually).</p>

                        <ul className="space-y-4 mb-10 text-[#1a1a1a] font-bold flex-grow">
                            {[
                                "Unlimited Subscriptions",
                                "Advanced Generative AI",
                                "Smart Alerts (Telegram/Discord)",
                                "Premium Chrome Extension",
                                "1-Click Cancellation",
                                "Only pay if you love it"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="w-6 h-6 text-[#1a1a1a] stroke-[4px]" /><span>{f}</span></li>
                            ))}
                        </ul>
                        <Link 
                            href="/login?mode=signup&plan=trial"
                            onClick={() => trackClick("/login?mode=signup&plan=trial")}
                            className="w-full bg-[#1a1a1a] text-white py-6 border-4 border-[#1a1a1a] font-black text-2xl hover:bg-zinc-800 transition-colors mt-auto uppercase shadow-[4px_4px_0px_#ffffff] flex items-center justify-center"
                        >
                            Start Free Trial ⚡
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

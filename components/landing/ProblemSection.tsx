"use client"

import React from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function ProblemSection() {
    return (
        <section className="py-24 relative overflow-hidden transition-colors duration-500">
            {/* Subtle Red/Orange Glow for "Problem" feel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 text-sm font-black text-[#1a1a1a] uppercase bg-red-400 border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a]">
                        <AlertTriangle size={18} />
                        STOP LOSING MONEY
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter uppercase leading-none">
                        YOU'RE PROBABLY PAYING <br className="hidden md:block" />
                        FOR <span className="text-red-500 bg-white border-4 border-[#1a1a1a] px-2">3 THINGS</span> YOU DON'T EVEN REMEMBER
                    </h2>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 font-bold italic">
                        That free trial from 6 months ago? It's still charging.
                        The gym app you used twice? Yeah, that one too.
                    </p>

                    <div className="relative max-w-4xl mx-auto mb-16 p-10 md:p-14 bg-white border-[6px] border-[#1a1a1a] shadow-[12px_12px_0px_#1a1a1a]">
                        <h3 className="text-2xl md:text-5xl font-black text-[#1a1a1a] italic leading-tight uppercase tracking-tighter">
                            "Your bank statement is a cemetery of good intentions."
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                            END THE SUBSCRIPTION CHAOS TODAY.
                        </p>
                        <div className="w-48 h-2 bg-[#1fe2c3] border-2 border-[#1a1a1a] mx-auto" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

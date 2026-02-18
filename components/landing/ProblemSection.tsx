"use client"

import React from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function ProblemSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-zinc-950">
            {/* Subtle Red/Orange Glow for "Problem" feel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold text-red-400 uppercase bg-red-400/10 border border-red-400/20 rounded-full">
                        <AlertTriangle size={14} />
                        Stop Wasting Money
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                        You're probably paying <br className="hidden md:block" />
                        for <span className="text-red-500">3 things</span> you've already forgotten about.
                    </h2>

                    <p className="max-w-3xl mx-auto text-xl text-zinc-400 mb-12 leading-relaxed">
                        That free trial from 6 months ago? It's still charging you.
                        The gym app you used twice? Yeah, that one too.
                    </p>

                    <div className="relative max-w-4xl mx-auto mb-16 p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-purple-500 opacity-20 font-serif">"</span>
                        <h3 className="text-2xl md:text-4xl font-bold text-white italic leading-tight">
                            Your bank statement is a cemetery of good intentions.
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-2xl font-bold text-white uppercase tracking-tighter">
                            End the subscription chaos.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

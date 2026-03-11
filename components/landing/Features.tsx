"use client"

import React from "react"
import { motion } from "framer-motion"
import { Layers, AlarmClock, ShieldCheck, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Control",
        description: "Know exactly how much leaves your account. Every month.",
        icon: Layers,
        color: "from-blue-500/20 to-blue-600/20",
        iconColor: "text-blue-400"
    },
    {
        title: "No More Surprises",
        description: "No more surprise charges. Get alerts 3 days before on Telegram.",
        icon: AlarmClock,
        color: "from-purple-500/20 to-purple-600/20",
        iconColor: "text-purple-400"
    },
    {
        title: "AI Powered",
        description: "Our AI analyzes your spending and suggests where you can save.",
        icon: ShieldCheck,
        color: "from-emerald-500/20 to-emerald-600/20",
        iconColor: "text-emerald-400"
    },
    {
        title: "Professional Export",
        description: "Need to analyze data or send to accounting? Download detailed statements in PDF or CSV with a single click.",
        icon: FileText,
        color: "from-orange-500/20 to-orange-600/20",
        iconColor: "text-orange-400"
    }
]

export default function Features() {
    return (
        <section id="features" className="py-20 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-[#1a1a1a] dark:text-white mb-6 tracking-tighter uppercase">
                        MASTER YOUR <span className="text-[#1fe2c3]">FINANCES</span>
                    </h2>
                    <p className="text-[#1a1a1a]/70 dark:text-zinc-400 max-w-2xl mx-auto text-xl font-bold italic">
                        WE BUILT THE TECH SO YOU NEVER LOSE CONTROL OF YOUR DIGITAL SPENDING AGAIN
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            title: "Auto-Detection Chrome Extension",
                            description: "Our extension identifies subscriptions as you browse, no manual entry required.",
                            icon: Layers,
                            color: "bg-[#1fe2c3]"
                        },
                        {
                            title: "Renewal Alerts",
                            description: "Get notifications via Telegram or Discord 3 days before any charge. No more surprises.",
                            icon: AlarmClock,
                            color: "bg-[#faed27]"
                        },
                        {
                            title: "Simple Financial Control",
                            description: "A clean, direct dashboard. See exactly where your money goes every month.",
                            icon: ShieldCheck,
                            color: "bg-purple-500"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative p-10 bg-white border-4 border-[#1a1a1a] hover:translate-x-[-8px] hover:translate-y-[-8px] hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all"
                        >
                            <div className={cn(
                                "w-20 h-20 border-4 border-[#1a1a1a] flex items-center justify-center mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform",
                                feature.color
                            )}>
                                <feature.icon size={40} className="text-[#1a1a1a]" />
                            </div>

                            <h2 className="text-2xl font-black text-[#1a1a1a] mb-6 leading-tight">
                                {feature.title}
                            </h2>
                            <p className="text-[#1a1a1a]/80 font-medium text-lg">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

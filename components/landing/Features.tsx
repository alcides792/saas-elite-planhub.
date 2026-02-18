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
        <section id="features" className="py-20 bg-black/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        The Solution
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        We develop the technology needed so you never lose control of your digital finances again.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all hover:shadow-2xl hover:shadow-purple-500/5 overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className={cn(
                                "absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-gradient-to-br",
                                feature.color
                            )} />

                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform",
                                feature.iconColor
                            )}>
                                <feature.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

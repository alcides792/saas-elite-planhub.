import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function NotificationChannels() {
    const channels = [
        {
            name: "Telegram",
            icon: "/telegram-3d.png",
            status: "Active",
            statusColor: "text-green-400 bg-green-400/10 border-green-400/20",
            active: true
        },
        {
            name: "E-mail",
            icon: "/gmail-icon-v2.png",
            status: "Active",
            statusColor: "text-green-400 bg-green-400/10 border-green-400/20",
            active: true
        },
        {
            name: "Discord",
            icon: "/discord-3d.png",
            status: "Active",
            statusColor: "text-green-400 bg-green-400/10 border-green-400/20",
            active: true
        },
        {
            name: "Kovr App",
            icon: "/kovr-logo.png",
            status: "Coming Soon",
            statusColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
            active: false
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden transition-colors duration-500">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-[#1a1a1a] dark:text-white uppercase">
                        SISTEMA DE <span className="text-[#1fe2c3] bg-[#1a1a1a] px-4">ALERTA</span>
                    </h2>
                    <p className="text-[#1a1a1a] dark:text-zinc-400 text-xl font-bold max-w-2xl mx-auto italic">
                        ESCOLHE ONDE QUERES RECEBER OS TEUS AVISOS DE RENOVAÇÃO E ALERTAS DE POUPANÇA.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {channels.map((channel, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 bg-white dark:bg-zinc-900/50 border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] flex flex-col items-center gap-8 group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#1a1a1a] transition-all"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 flex items-center justify-center relative z-10 p-4 border-2 border-[#1a1a1a] bg-zinc-50 dark:bg-[#1a1a1a] transform group-hover:rotate-3 transition-transform">
                                    <Image
                                        src={channel.icon}
                                        alt={channel.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white tracking-tight uppercase">{channel.name}</h3>
                                <div className={`text-xs font-black uppercase tracking-widest px-4 py-2 border-2 border-[#1a1a1a] ${channel.statusColor} bg-white shadow-[2px_2px_0px_#1a1a1a]`}>
                                    ● {channel.active ? 'ATIVO' : 'EM BREVE'}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

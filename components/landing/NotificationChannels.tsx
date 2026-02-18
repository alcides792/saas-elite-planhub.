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
            status: "Coming Soon",
            statusColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
            active: false
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
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white">
                        ALERT <span className="text-purple-500">SYSTEM</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Choose where you want to receive your expiration notices and savings alerts.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {channels.map((channel, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-sm flex flex-col items-center gap-6 group hover:border-purple-500/30 transition-all shadow-xl shadow-black/50"
                        >
                            <div className="relative">
                                {/* Icon Glow */}
                                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-20 h-20 flex items-center justify-center relative z-10">
                                    <Image
                                        src={channel.icon}
                                        alt={channel.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-tight">{channel.name}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${channel.statusColor} inline-block`}>
                                    ● {channel.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

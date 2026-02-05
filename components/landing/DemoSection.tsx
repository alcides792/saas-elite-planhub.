"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function DemoSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-bold mb-6"
                    >
                        <Play size={14} className="fill-blue-400" />
                        VÍDEO DEMONSTRAÇÃO
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                    >
                        VEJA O <span className="text-blue-500">KOVR</span> EM AÇÃO
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-xl max-w-2xl mx-auto"
                    >
                        Assista como transformamos a gestão de assinaturas em algo simples e automático.
                    </motion.p>
                </div>

                {/* Video Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative group"
                >
                    {/* Glowing Backlight */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                    <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                        {/* YouTube Iframe Placeholder */}
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Kovr Demo Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-zinc-500 font-medium italic text-lg">
                        "Gerir as suas assinaturas nunca foi tão simples."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

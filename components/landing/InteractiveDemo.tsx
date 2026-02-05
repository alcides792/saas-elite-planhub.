"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Bell, Brain, Globe } from "lucide-react";

interface Tab {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
    imagePath: string;
}

const tabs: Tab[] = [
    {
        id: "dashboard",
        label: "Dashboard 360°",
        shortLabel: "Visão total.",
        icon: LayoutDashboard,
        description: "Centralize todas as suas assinaturas num painel cyberpunk intuitivo. Acompanhe gastos mensais e anuais em tempo real.",
        gradient: "from-blue-500 via-purple-500 to-pink-500",
        imagePath: "/dashboard-preview.png"
    },
    {
        id: "alerts",
        label: "Smart Alerts",
        shortLabel: "Alertas.",
        icon: Bell,
        description: "Nunca mais seja cobrado de surpresa. O Kovr avisa-o no Telegram ou E-mail 3 dias antes de qualquer renovação.",
        gradient: "from-purple-500 via-pink-500 to-red-500",
        imagePath: "/alerts-preview.png"
    },
    {
        id: "ai",
        label: "IA Analytics",
        shortLabel: "Inteligência Artificial.",
        icon: Brain,
        description: "A nossa Inteligência Artificial analisa o seu histórico, identifica gastos duplicados e sugere onde pode cortar custos.",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        imagePath: "/ai-preview.png"
    },
    {
        id: "extension",
        label: "Extensão Mágica",
        shortLabel: "1 Clique.",
        icon: Globe,
        description: "Preguiça de adicionar manualmente? Instale a nossa **Extensão do Navegador**. Ela deteta quando está num site de assinatura (como a Netflix) e adiciona ao Kovr com 1 clique.",
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        imagePath: "/extension-preview.png"
    }
];

export default function InteractiveDemo() {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm font-bold mb-6"
                    >
                        <LayoutDashboard size={14} />
                        DEMONSTRAÇÃO INTERATIVA
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                    >
                        EXPLORE O <span className="text-purple-500">KOVR</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-xl max-w-2xl mx-auto"
                    >
                        Descubra como cada funcionalidade trabalha para simplificar a gestão das suas assinaturas.
                    </motion.p>
                </div>

                {/* Interactive Demo Grid */}
                <div className="grid lg:grid-cols-[280px_1fr_320px] gap-8 items-start">
                    {/* Tab Buttons - Left Column */}
                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                        {tabs.map((tab, idx) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <motion.button
                                    key={tab.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative flex items-center gap-4 px-6 py-4 rounded-2xl
                                        transition-all duration-300 whitespace-nowrap lg:whitespace-normal
                                        ${isActive
                                            ? 'bg-purple-600/20 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                                            : 'bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-900/80'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <div className={`
                                        relative z-10 p-2 rounded-xl
                                        ${isActive ? 'bg-purple-500/20' : 'bg-white/5'}
                                    `}>
                                        <Icon size={20} className={isActive ? 'text-purple-400' : 'text-zinc-400'} />
                                    </div>

                                    <div className="relative z-10 text-left">
                                        <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                            {tab.label}
                                        </div>
                                        <div className={`text-xs ${isActive ? 'text-purple-300' : 'text-zinc-600'}`}>
                                            {tab.shortLabel}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Preview Area - Center Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Glowing Backlight */}
                        <div className="absolute -inset-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                        <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    className={`absolute inset-0 bg-gradient-to-br ${currentTab.gradient} opacity-20`}
                                />
                            </AnimatePresence>

                            {/* Placeholder for actual screenshots */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center"
                                    >
                                        {React.createElement(currentTab.icon, {
                                            size: 80,
                                            className: "mx-auto mb-4 text-white/20"
                                        })}
                                        <p className="text-white/40 text-sm font-mono">
                                            {currentTab.label} Preview
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Grid Overlay for Cyberpunk Effect */}
                            <div
                                className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Description - Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:sticky lg:top-24"
                    >
                        <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        {React.createElement(currentTab.icon, {
                                            size: 24,
                                            className: "text-purple-400"
                                        })}
                                        <h3 className="text-2xl font-black text-white">
                                            {currentTab.label}
                                        </h3>
                                    </div>

                                    <p className="text-zinc-400 leading-relaxed text-lg">
                                        {currentTab.description}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentTab.gradient} bg-opacity-10 border border-white/10`}>
                                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                                                Funcionalidade Ativa
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Bell, Brain, Globe, Layers } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import LiveDashboardDemo from "./LiveDashboardDemo";
import LiveAnalyticsDemo from "./LiveAnalyticsDemo";
import LiveSubscriptionsDemo from "./LiveSubscriptionsDemo";
import LiveAlertsDemo from "./LiveAlertsDemo";

interface Tab {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
}

const tabs: Tab[] = [
    {
        id: "dashboard",
        label: "360° Dashboard",
        shortLabel: "Total vision.",
        icon: LayoutDashboard,
        description: "Centralize all your subscriptions in an intuitive cyberpunk dashboard. Track monthly and yearly spending in real-time.",
        gradient: "from-blue-500 via-purple-500 to-pink-500",
    },
    {
        id: "subscriptions",
        label: "Full Management",
        shortLabel: "Control.",
        icon: Layers,
        description: "Keep all your subscriptions organized in a professional list. Filter by category, price, and renewal date with ease.",
        gradient: "from-indigo-500 via-blue-500 to-emerald-500",
    },
    {
        id: "alerts",
        label: "Smart Alerts",
        shortLabel: "Alerts.",
        icon: Bell,
        description: "Never be charged by surprise again. Kovr alerts you on Telegram or Email 3 days before any renewal.",
        gradient: "from-purple-500 via-pink-500 to-red-500",
    },
    {
        id: "ai",
        label: "AI Analytics",
        shortLabel: "Artificial Intelligence.",
        icon: Brain,
        description: "Our Artificial Intelligence analyzes your history, identifies duplicate spending, and suggests where you can cut costs.",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
        id: "extension",
        label: "Magic Extension",
        shortLabel: "1 Click.",
        icon: Globe,
        description: "Too lazy to add manually? Install our Browser Extension. It detects when you're on a subscription site (like Netflix) and adds it to Kovr with 1 click.",
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
    }
];

export default function InteractiveDemo() {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

    useEffect(() => {
        setMounted(true);
    }, []);



    return (
        <section className="py-24 relative overflow-hidden transition-colors duration-500">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-6"
                    >
                        <LayoutDashboard size={14} />
                        INTERACTIVE DEMO
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter"
                    >
                        EXPLORE <span className="text-purple-600 dark:text-purple-500">KOVR</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto"
                    >
                        Discover how each feature works to simplify your subscription management.
                    </motion.p>
                </div>

                {/* Interactive Demo Grid - 2 Columns Layout */}
                <div className="grid lg:grid-cols-[350px_1fr] gap-12 items-start">
                    {/* Tab Selection - Left Column */}
                    <div className="flex flex-col gap-4">
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
                                        relative flex flex-col items-start gap-4 px-8 py-6 rounded-3xl
                                        transition-all duration-500 text-left
                                        ${isActive
                                            ? 'bg-white dark:bg-zinc-900 shadow-xl shadow-purple-500/10 border-2 border-purple-500'
                                            : 'bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-white/10'}
                                    `}
                                >
                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className={`
                                            p-3 rounded-xl transition-colors duration-300
                                            ${isActive ? 'bg-purple-600 dark:bg-purple-500 text-white' : 'bg-zinc-200 dark:bg-white/5 text-zinc-500 dark:text-zinc-400'}
                                        `}>
                                            <Icon size={24} />
                                        </div>

                                        <div className="flex flex-col">
                                            <div className={`font-black text-lg ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                                {tab.label}
                                            </div>
                                            <div className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                                {tab.shortLabel}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Description when Active */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden relative z-10"
                                            >
                                                <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    {tab.description}
                                                </p>

                                                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                                                        Active Tool
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Full Preview Area - Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group lg:sticky lg:top-24"
                    >
                        {/* Glowing Backlight - Larger and brighter */}
                        <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

                        <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:scale-[1.01]">
                            {/* Actual Preview Image or Placeholder */}
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab + (activeTab === "dashboard" && mounted ? resolvedTheme : "")}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full h-full flex items-center justify-center"
                                    >
                                        {activeTab === "dashboard" ? (
                                            <div className="w-full h-full scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-[1.02] transition-transform origin-center">
                                                <LiveDashboardDemo />
                                            </div>
                                        ) : activeTab === "ai" ? (
                                            <div className="w-full h-full scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-[1.02] transition-transform origin-center">
                                                <LiveAnalyticsDemo />
                                            </div>
                                        ) : activeTab === "subscriptions" ? (
                                            <div className="w-full h-full scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-[1.02] transition-transform origin-center">
                                                <LiveSubscriptionsDemo />
                                            </div>
                                        ) : activeTab === "alerts" ? (
                                            <div className="w-full h-full scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-[1.02] transition-transform origin-center">
                                                <LiveAlertsDemo />
                                            </div>
                                        ) : (
                                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                {React.createElement(currentTab.icon, {
                                                    size: 120,
                                                    className: "mx-auto mb-6 text-zinc-400/10 dark:text-white/10"
                                                })}
                                                <p className="text-zinc-500/20 dark:text-white/20 text-xl font-mono">
                                                    {currentTab.label} Preview
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Grid Overlay for Cyberpunk Effect */}
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                    backgroundSize: '30px 30px'
                                }}
                            />
                        </div>

                        {/* Floating elements to decorate */}
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform group-hover:rotate-0">
                            <Brain className="text-white" size={24} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bell, Mail, MessageSquare, Clock, CalendarClock,
    TrendingUp, CheckCircle2, AlertCircle, Save,
    ShieldAlert, Smartphone, Gamepad2
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Mock UI Components (Static replicas for the demo)
const MockSwitch = ({ checked }: { checked: boolean }) => (
    <div className={cn(
        "w-8 h-4 rounded-full transition-colors relative",
        checked ? "bg-purple-600" : "bg-zinc-700"
    )}>
        <div className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
            checked ? "left-4.5" : "left-0.5"
        )} />
    </div>
);

export default function LiveAlertsDemo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const cardStyle = "bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-4 rounded-2xl relative overflow-hidden shadow-sm hover:border-purple-500/30 transition-all";

    return (
        <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-black group/window">
            {/* macOS Title Bar */}
            <div className="h-10 bg-gray-100 dark:bg-[#111] flex items-center px-4 shrink-0 transition-colors">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-zinc-500">Notification Orchestrator</span>
                </div>
            </div>

            {/* App Body */}
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 h-full bg-gray-50 dark:bg-[#0A0A0A] overflow-y-auto relative transition-colors">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]"
                        style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                    <div className="p-6 md:p-8 relative z-10 text-left">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                                Alert <span className="text-purple-600 dark:text-purple-500">Center</span>
                            </h1>
                            <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-widest">Configure how and when you want to be notified.</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT COLUMN: Channels */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-6 bg-purple-500 rounded-full" />
                                    <h2 className="text-[9px] font-black text-gray-500 dark:text-neutral-400 uppercase tracking-widest">Available Channels</h2>
                                </div>

                                {/* Telegram Card */}
                                <div className={cardStyle}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#0088CC]/10 rounded-xl flex items-center justify-center">
                                                <MessageSquare size={20} className="text-[#0088CC]" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black dark:text-white">Telegram Bot</h3>
                                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Connected
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">Manage</div>
                                    </div>
                                </div>

                                {/* Channel Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={cardStyle}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                <Mail size={16} className="text-red-500" />
                                            </div>
                                            <h3 className="text-[11px] font-black dark:text-white">Email</h3>
                                        </div>
                                        <p className="text-[9px] text-zinc-500 font-bold leading-tight">Reports sent weekly.</p>
                                        <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black text-emerald-500/80 uppercase tracking-widest">
                                            <CheckCircle2 size={10} /> Enabled
                                        </div>
                                    </div>
                                    <div className={cardStyle}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <MessageSquare size={16} className="text-emerald-500" />
                                            </div>
                                            <h3 className="text-[11px] font-black dark:text-white">WhatsApp</h3>
                                        </div>
                                        <p className="text-[9px] text-zinc-500 font-bold leading-tight">Direct alerts via chat.</p>
                                        <div className="mt-3 inline-block px-1.5 py-0.5 bg-purple-500/10 rounded-md text-[8px] font-black text-purple-400 uppercase tracking-widest">Soon</div>
                                    </div>
                                </div>

                                {/* Grayscale Small Cards */}
                                <div className="grid grid-cols-2 gap-4 opacity-40 grayscale">
                                    <div className={cn(cardStyle, "p-3 flex items-center gap-3")}>
                                        <Gamepad2 size={16} className="text-zinc-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Discord</span>
                                    </div>
                                    <div className={cn(cardStyle, "p-3 flex items-center gap-3")}>
                                        <Smartphone size={16} className="text-zinc-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Native App</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Settings */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-6 bg-purple-500 rounded-full" />
                                    <h2 className="text-[9px] font-black text-gray-500 dark:text-neutral-400 uppercase tracking-widest">Preferences</h2>
                                </div>

                                <div className={cn(cardStyle, "space-y-4")}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black dark:text-white leading-none">Bill Reminders</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1">3 days before due date</p>
                                        </div>
                                        <MockSwitch checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black dark:text-white leading-none">Price Changes</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Alert on subscription rise</p>
                                        </div>
                                        <MockSwitch checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black dark:text-white leading-none">Weekly PDF</p>
                                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Summary of expenses</p>
                                        </div>
                                        <MockSwitch checked={false} />
                                    </div>
                                </div>

                                <div className={cn(cardStyle, "space-y-4")}>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Delivery Time</label>
                                        <div className="w-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold dark:text-white flex items-center justify-between">
                                            09:00 AM
                                            <Clock size={14} className="text-zinc-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Buffer Days</label>
                                        <div className="w-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold dark:text-white flex items-center justify-between">
                                            5 Days Before
                                            <CalendarClock size={14} className="text-zinc-500" />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                    <Save size={16} />
                                    Save Configurations
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

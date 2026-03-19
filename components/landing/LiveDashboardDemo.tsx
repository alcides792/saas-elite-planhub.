'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Wallet, TrendingUp, Layers,
    MoreVertical, ChevronDown, ChevronUp
} from 'lucide-react';
import { useTheme } from 'next-themes';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import { cn } from '@/lib/utils';

// Mock Data to replicate the experience
const mockSubscriptions = [
    {
        id: '1',
        name: 'Apple TV+',
        category: 'Streaming',
        amount: 9.99,
        billing_cycle: 'monthly',
        next_payment: '2026-03-15',
        website: 'https://tv.apple.com',
        status: 'active'
    },
    {
        id: '2',
        name: 'Spotify',
        category: 'Music',
        amount: 10.99,
        billing_cycle: 'monthly',
        next_payment: '2026-03-10',
        website: 'https://spotify.com',
        status: 'active'
    },
    {
        id: '3',
        name: 'Disney+',
        category: 'Streaming',
        amount: 13.99,
        billing_cycle: 'monthly',
        next_payment: '2026-03-22',
        website: 'https://disneyplus.com',
        status: 'active'
    },
    {
        id: '4',
        name: 'YouTube Premium',
        category: 'Entertainment',
        amount: 13.99,
        billing_cycle: 'monthly',
        next_payment: '2026-03-05',
        website: 'https://youtube.com',
        status: 'active'
    },
    {
        id: '5',
        name: 'Netflix',
        category: 'Streaming',
        amount: 19.99,
        billing_cycle: 'monthly',
        next_payment: '2026-03-28',
        website: 'https://netflix.com',
        status: 'active'
    }
];

const getCategoryStyles = (category: string) => {
    const styles: Record<string, string> = {
        streaming: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
        productivity: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        software: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        gaming: 'bg-green-500/10 text-green-500 border-green-500/20',
        health: 'bg-red-500/10 text-red-500 border-red-500/20',
        other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    };
    const cat = category?.toLowerCase() || 'other';
    return styles[cat] || styles.other;
};

export default function LiveDashboardDemo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

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
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-zinc-500">Kovr Web App</span>
                </div>
            </div>

            {/* App Body */}
            <div className="flex flex-1 overflow-hidden relative">


                {/* 2. MAIN CONTENT (Clone) */}
                <main className="flex-1 h-full bg-gray-50 dark:bg-[#0A0A0A] overflow-y-auto relative transition-colors">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]"
                        style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                    <div className="p-6 md:p-8 relative z-10">
                        {/* Dashboard Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
                                <p className="text-xs text-zinc-500 mt-0.5">Overview of your financial dashboard.</p>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20 cursor-default">
                                <Plus size={16} strokeWidth={3} />
                                New Subscription
                            </button>
                        </header>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-5 rounded-[1.5rem] shadow-sm">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 w-fit mb-3">
                                    <Wallet size={18} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Monthly Spend</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">$66.96</p>
                            </div>
                            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-5 rounded-[1.5rem] shadow-sm">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 w-fit mb-3">
                                    <TrendingUp size={18} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Yearly Projection</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">$803.52</p>
                            </div>
                            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-5 rounded-[1.5rem] shadow-sm">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 w-fit mb-3">
                                    <Layers size={18} />
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Active</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white">5</p>
                            </div>
                        </div>

                        {/* Subscription List (Clone of SubscriptionList.tsx) */}
                        <div className="space-y-3">
                            {mockSubscriptions.map((sub, index) => (
                                <div
                                    key={sub.name}
                                    className="w-full flex items-center justify-between p-4 bg-white/70 dark:bg-[#0A0A0A]/60 border border-gray-200 dark:border-white/5 hover:border-purple-500/30 hover:bg-white dark:hover:bg-black transition-all cursor-default rounded-2xl group/item shadow-sm"
                                >
                                    <div className="flex items-center gap-4 flex-[2]">
                                        <SubscriptionLogo
                                            name={sub.name}
                                            domain={sub.website ? new URL(sub.website).hostname : undefined}
                                            size="md"
                                        />
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors uppercase tracking-tight">{sub.name}</h4>
                                            <span className={cn("text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border", getCategoryStyles(sub.category))}>
                                                {sub.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center hidden sm:block">
                                        <p className="font-black text-gray-900 dark:text-white text-base">
                                            ${sub.amount}
                                        </p>
                                        <p className="text-[9px] text-gray-500 dark:text-neutral-400 uppercase font-black tracking-tighter">
                                            {sub.billing_cycle}
                                        </p>
                                    </div>

                                    <div className="flex-1 text-right hidden lg:block px-4">
                                        <p className="text-[10px] text-gray-500 dark:text-neutral-400 font-bold">
                                            Renews in <span className="text-gray-900 dark:text-white font-black uppercase">5 days</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 text-zinc-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                            <MoreVertical size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

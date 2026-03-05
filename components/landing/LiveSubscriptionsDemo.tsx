'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Filter, Wallet, TrendingUp, Layers,
    ChevronDown, MoreVertical, Edit2, Trash2, Pause
} from 'lucide-react';
import { useTheme } from 'next-themes';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import { cn } from '@/lib/utils';

// Mock Data (Consistent with Dashboard Demo)
const mockSubscriptions = [
    {
        id: '1',
        name: 'Apple TV+',
        amount: 9.99,
        currency: 'USD',
        billing_cycle: 'monthly',
        category: 'streaming',
        next_payment: '2026-03-15',
        status: 'active',
        website: 'https://tv.apple.com'
    },
    {
        id: '2',
        name: 'Spotify',
        amount: 10.99,
        currency: 'USD',
        billing_cycle: 'monthly',
        category: 'music',
        next_payment: '2026-03-10',
        status: 'active',
        website: 'https://spotify.com'
    },
    {
        id: '3',
        name: 'Disney+',
        amount: 13.99,
        currency: 'USD',
        billing_cycle: 'monthly',
        category: 'entertainment',
        next_payment: '2026-03-22',
        status: 'active',
        website: 'https://disneyplus.com'
    },
    {
        id: '4',
        name: 'YouTube Premium',
        amount: 13.99,
        currency: 'USD',
        billing_cycle: 'monthly',
        category: 'entertainment',
        next_payment: '2026-03-05',
        status: 'active',
        website: 'https://youtube.com'
    },
    {
        id: '5',
        name: 'Netflix',
        amount: 19.99,
        currency: 'USD',
        billing_cycle: 'monthly',
        category: 'streaming',
        next_payment: '2026-03-28',
        status: 'active',
        website: 'https://netflix.com'
    }
];

export default function LiveSubscriptionsDemo() {
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
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-zinc-500">Service Management Center</span>
                </div>
            </div>

            {/* App Body */}
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 h-full bg-gray-50 dark:bg-[#0A0A0A] overflow-y-auto relative transition-colors">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]"
                        style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                    <div className="p-6 md:p-8 relative z-10 text-left">
                        {/* Header & Actions */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">My Subscriptions</h1>
                                <p className="text-xs text-zinc-500 mt-2 font-bold leading-tight">Manage your recurring expenses and never miss a due date.</p>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black transition-all shadow-lg shadow-purple-500/20 cursor-default">
                                <Plus size={16} strokeWidth={3} />
                                <span>NEW SUBSCRIPTION</span>
                            </button>
                        </header>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {[
                                { label: 'Monthly Spending', value: '$68.95', icon: Wallet, color: 'text-emerald-500' },
                                { label: 'Yearly Spending', value: '$827.40', icon: TrendingUp, color: 'text-purple-500' },
                                { label: 'Total active', value: '5', icon: Layers, color: 'text-blue-500' }
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center", kpi.color)}>
                                            <kpi.icon size={16} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black">{kpi.label}</p>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{kpi.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Control Bar (Filters) */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search subscriptions..."
                                    readOnly
                                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs dark:text-white placeholder-gray-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <div className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 min-w-[140px]">
                                        All Categories
                                        <ChevronDown size={14} className="absolute right-3" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 min-w-[140px]">
                                        Most Recent
                                        <ChevronDown size={14} className="absolute right-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscriptions List */}
                        <div className="space-y-3">
                            {mockSubscriptions.map((sub, i) => (
                                <div key={sub.id} className="group/row bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-purple-500/30 hover:bg-white/80 dark:hover:bg-black/60 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <SubscriptionLogo
                                            name={sub.name}
                                            domain={new URL(sub.website).hostname}
                                            size="md"
                                        />
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">{sub.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{sub.category}</p>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-center">
                                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Billing</span>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 capitalize">{sub.billing_cycle}</span>
                                    </div>

                                    <div className="hidden md:flex flex-col items-center">
                                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Next Date</span>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            {new Date(sub.next_payment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900 dark:text-white">${sub.amount}</p>
                                            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">{sub.currency}</p>
                                        </div>
                                        <button className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-zinc-500 hover:text-white hover:bg-purple-600 transition-all cursor-default opacity-0 group-hover/row:opacity-100">
                                            <MoreVertical size={16} />
                                        </button>
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

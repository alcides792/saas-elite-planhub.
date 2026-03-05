'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, TrendingUp, Calendar, ArrowUpRight,
    ArrowDownRight, Package, ShieldCheck, Zap,
    MoreVertical, Plus, ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import { cn } from '@/lib/utils';

// Dynamic imports for Recharts to prevent hydration issues
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(mod => mod.ReferenceLine), { ssr: false });

const NEON_PURPLE = '#8b5cf6';
const NEON_PINK = '#ec4899';
const NEON_BLUE = '#3b82f6';

// Mock Data
const monthlyTrendData = [
    { month: 'Sep', total: 42.50 },
    { month: 'Oct', total: 45.90 },
    { month: 'Nov', total: 58.00 },
    { month: 'Dec', total: 58.00 },
    { month: 'Jan', total: 62.10 },
    { month: 'Feb', total: 66.96 },
];

const necessityData = [
    { name: 'Essential', value: 45.98, color: NEON_BLUE },
    { name: 'Leisure', value: 20.98, color: NEON_PINK }
];

const mockOpportunities = [
    { name: 'Apple TV+', amount: 9.99, website: 'https://tv.apple.com' },
    { name: 'Disney+', amount: 13.99, website: 'https://disneyplus.com' },
    { name: 'Netflix', amount: 19.99, website: 'https://netflix.com' },
];

// Heatmap Data (simplified 31-day grid)
const heatmapData = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    count: [5, 10, 15, 22, 28].includes(i + 1) ? 1 : ([12, 18].includes(i + 1) ? 2 : 0)
}));

export default function LiveAnalyticsDemo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const essentialPercentage = 68;

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
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-zinc-500">Kovr Analytics Engine</span>
                </div>
            </div>

            {/* App Body */}
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 h-full bg-gray-50 dark:bg-[#0A0A0A] overflow-y-auto relative transition-colors">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]"
                        style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#fff' : '#000'}11 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                    <div className="p-6 md:p-8 relative z-10">
                        {/* Executive Header */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Finance Analytics</h1>
                                <p className="text-xs text-zinc-500 mt-1 font-bold">Detailed analysis of your spending and trends.</p>
                            </div>
                        </header>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
                            {[
                                { label: 'Monthly Run Rate', value: '$66.96', detail: '+$4.86 vs last month', icon: Wallet, color: 'text-emerald-500', trend: 'STABLE' },
                                { label: 'Annual Run Rate', value: '$803.52', detail: 'Next 12 months projection', icon: TrendingUp, color: 'text-purple-500' },
                                { label: 'Active Services', value: '5', detail: 'Above average usage', icon: ShieldCheck, color: 'text-blue-500' },
                                { label: 'Avg. Cost per Sub', value: '$13.39', detail: 'Avg cost per active service', icon: Zap, color: 'text-amber-500' }
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-4 rounded-2xl group relative overflow-hidden shadow-sm text-left">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={cn("w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center", kpi.color)}>
                                            <kpi.icon size={16} strokeWidth={2.5} />
                                        </div>
                                        {kpi.trend && (
                                            <div className="text-[8px] font-black px-1.5 py-0.5 rounded-md text-emerald-500 bg-emerald-500/10">
                                                {kpi.trend}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black mb-0.5">{kpi.label}</p>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{kpi.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Financial Evolution Chart */}
                        <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-[2rem] mb-8 shadow-sm text-left">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Financial Evolution</h4>
                                    <p className="text-[10px] text-gray-500 font-bold">Spending history for the last 6 months.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    <span className="text-[8px] text-zinc-500 font-black">MONTHLY SPEND</span>
                                </div>
                            </div>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyTrendData}>
                                        <defs>
                                            <linearGradient id="demoColorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={NEON_PURPLE} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={NEON_PURPLE} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} vertical={false} opacity={0.2} />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: isDark ? '#0D0D0D' : '#FFF', borderRadius: '12px', border: '1px solid #333', fontSize: '10px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke={NEON_PURPLE}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#demoColorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-left">
                            {/* Necessity Breakdown */}
                            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-[2rem] shadow-sm text-left">
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black mb-6">Necessity Breakdown</h4>
                                <div className="flex items-center gap-6">
                                    <div className="h-[140px] w-1/2 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={necessityData}
                                                    innerRadius={45}
                                                    outerRadius={65}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {necessityData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-xl font-black text-gray-900 dark:text-white">{essentialPercentage}%</span>
                                            <span className="text-[8px] text-gray-500 font-black">CORE</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        {necessityData.map((item, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                                                    <span>{item.name}</span>
                                                    <span className="text-zinc-500">${item.value}</span>
                                                </div>
                                                <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${(item.value / 67) * 100}%`, backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Heatmap */}
                            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-[2rem] shadow-sm text-left">
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black mb-4">Payment Distribution</h4>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {heatmapData.map((d, i) => {
                                        let intensity = 'bg-black/5 dark:bg-white/5';
                                        if (d.count === 1) intensity = 'bg-purple-500/30 border border-purple-500/20';
                                        if (d.count >= 2) intensity = 'bg-purple-500 border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]';

                                        return (
                                            <div
                                                key={i}
                                                className={cn("aspect-square rounded-md flex items-center justify-center text-[7px] font-black transition-all", intensity)}
                                            >
                                                <span className={d.count >= 2 ? 'text-white' : 'text-zinc-500'}>{d.day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Opportunities Table */}
                        <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-[2rem] shadow-sm overflow-hidden text-left">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Optimization Opportunities</h4>
                            <div className="space-y-4">
                                {mockOpportunities.map((opp, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <SubscriptionLogo
                                                name={opp.name}
                                                domain={new URL(opp.website).hostname}
                                                size="sm"
                                            />
                                            <span className="font-bold text-xs text-gray-900 dark:text-white tracking-tight">{opp.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-emerald-500 text-[10px] font-black">-${(opp.amount * 12).toFixed(2)}/yr</span>
                                            <span className="text-[8px] text-zinc-500 font-bold uppercase">SAVINGS</span>
                                        </div>
                                        <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-zinc-400 uppercase tracking-widest cursor-default">
                                            Audit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

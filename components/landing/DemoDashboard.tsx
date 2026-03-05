'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    TrendingUp,
    CreditCard,
    Zap
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from 'recharts';
import { useTheme } from 'next-themes';

const MOCK_CHART_DATA = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 66.96 },
];

export default function DemoDashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full h-full p-4 md:p-8 flex flex-col gap-6 bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Overview</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Mock Dashboard</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 opacity-80 cursor-default">
                    <Plus size={16} strokeWidth={3} />
                    New Subscription
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 w-fit mb-2">
                        <CreditCard size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Monthly Spend</p>
                    <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">$66.96</p>
                </div>
                <div className="bg-white/80 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 w-fit mb-2">
                        <TrendingUp size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Yearly</p>
                    <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">$803.52</p>
                </div>
                <div className="bg-white/80 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400 w-fit mb-2">
                        <Zap size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Active</p>
                    <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">5</p>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[150px] bg-white/40 dark:bg-zinc-950/30 rounded-3xl p-6 border border-zinc-100 dark:border-white/5 relative overflow-hidden">
                <div className="mb-4">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Evolution</h4>
                </div>
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_CHART_DATA}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDark ? '#52525b' : '#a1a1aa', fontSize: 10, fontWeight: 'bold' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: isDark ? '#09090b' : '#fff',
                                    border: isDark ? '1px solid #27272a' : '1px solid #e4e4e7',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}
                                cursor={{ fill: isDark ? '#18181b' : '#f4f4f5' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {MOCK_CHART_DATA.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === MOCK_CHART_DATA.length - 1 ? '#9333ea' : (isDark ? '#3f3f46' : '#d4d4d8')}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            </div>
        </div>
    );
}

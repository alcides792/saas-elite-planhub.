'use client';

import React, { useMemo } from 'react';
import {
    Wallet,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    ShieldCheck,
    Zap,
    Download
} from 'lucide-react';
import dynamic from 'next/dynamic';

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
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { formatDate } from '@/lib/utils/analytics';
import { useTheme } from 'next-themes';
import SubscriptionLogo from '@/components/ui/subscription-logo';

interface AnalyticsClientProps {
    analytics: any;
    realNextRenewal: any;
    subscriptionsCount: number;
    monthlyTrendData: any[];
    categoryData: any[];
}

const NEON_PURPLE = '#8b5cf6';
const NEON_PINK = '#ec4899';
const NEON_BLUE = '#3b82f6';

const ESSENTIAL_CATEGORIES = ['Dev', 'Hosting', 'Internet', 'Education', 'Productivity', 'Software', 'Work', 'Utilities'];

const CustomAreaTooltip = ({ active, payload, label, formatMoney }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-[#0D0D0D] border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl min-w-[180px]">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-500 font-black mb-2">{label}</p>
                <div className="space-y-1 mb-3">
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                        {formatMoney ? formatMoney(payload[0].value) : payload[0].value}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold">
                        {data.isFuture ? 'Monthly Projection' : 'Monthly Total'}
                    </p>
                </div>
                {data.subscriptionCount && (
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold">SUBSCRIPTIONS</span>
                        <span className="text-[10px] text-gray-700 dark:text-zinc-300 font-black">{data.subscriptionCount}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export default function AnalyticsClient({
    analytics,
    realNextRenewal,
    subscriptionsCount,
    monthlyTrendData,
    categoryData
}: AnalyticsClientProps) {
    const { formatMoney } = useUser();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 1. Logic for Essential vs Discretionary
    const necessityData = useMemo(() => {
        let essential = 0;
        let discretionary = 0;

        categoryData.forEach(item => {
            const isEssential = ESSENTIAL_CATEGORIES.some(cat =>
                item.category.toLowerCase().includes(cat.toLowerCase())
            );
            if (isEssential) essential += item.amount;
            else discretionary += item.amount;
        });

        const total = essential + discretionary;
        if (total === 0) return [];

        return [
            { name: 'Essential', value: essential, color: NEON_BLUE },
            { name: 'Leisure', value: discretionary, color: NEON_PINK }
        ];
    }, [categoryData]);

    const essentialPercentage = useMemo(() => {
        const total = necessityData.reduce((acc, curr) => acc + curr.value, 0);
        if (total === 0) return 0;
        const essential = necessityData.find(d => d.name === 'Essential')?.value || 0;
        return Math.round((essential / total) * 100);
    }, [necessityData]);

    // 2. Logic for Heatmap Grid (1-31)
    const heatmapData = useMemo(() => {
        const days = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, count: 0, subs: [] as any[] }));

        analytics.nextRenewals.forEach((sub: any) => {
            const day = new Date(sub.renewal_date).getDate();
            if (day >= 1 && day <= 31) {
                days[day - 1].count += 1;
                days[day - 1].subs.push(sub);
            }
        });

        return days;
    }, [analytics.nextRenewals]);

    // 3. Trends calculation
    const mrrTrend = useMemo(() => {
        if (monthlyTrendData.length >= 2) {
            const current = monthlyTrendData[monthlyTrendData.length - 1].total;
            const previous = monthlyTrendData[monthlyTrendData.length - 2].total;
            return current - previous;
        }
        return 0;
    }, [monthlyTrendData]);

    const avgCostPerSub = subscriptionsCount > 0 ? analytics.monthlyTotal / subscriptionsCount : 0;

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Executive Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-black">Executive Dashboard</span>
                    </div>
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Finance Analytics</h1>
                    <p className="text-zinc-400 font-medium mt-1">360º view of your recurrent capital flow.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/10 transition-all cursor-not-allowed opacity-50">
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </header>

            {/* Section 1: KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                    { label: 'Monthly Run Rate', value: formatMoney(analytics.monthlyTotal), detail: `${mrrTrend >= 0 ? '+' : ''}${formatMoney(mrrTrend)} vs last month`, icon: Wallet, color: 'text-emerald-500', trend: mrrTrend >= 0 ? 'up' : 'down' },
                    { label: 'Annual Run Rate', value: formatMoney(analytics.annualProjection), detail: 'Projection for the next 12 months', icon: TrendingUp, color: 'text-purple-500' },
                    { label: 'Active Services', value: subscriptionsCount, detail: `${subscriptionsCount > 5 ? 'Above average' : 'Controlled'} usage`, icon: ShieldCheck, color: 'text-blue-500' },
                    { label: 'Avg. Cost per Sub', value: formatMoney(avgCostPerSub), detail: 'Average cost per active service', icon: Zap, color: 'text-amber-500' }
                ].map((kpi, i) => (
                    <motion.div key={i} variants={itemVariants} className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-3xl group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all" />
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon size={20} strokeWidth={2.5} />
                            </div>
                            {kpi.trend && (
                                <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${kpi.trend === 'up' ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                                    {kpi.trend === 'up' ? 'INCREASE' : 'STABLE'}
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{kpi.value}</h3>
                        <p className="text-[10px] text-gray-500 dark:text-neutral-400 font-bold">{kpi.detail}</p>
                    </motion.div>
                ))}
            </div>

            {/* Section 2: Main Evolution Chart */}
            <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem] mb-10 overflow-hidden relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Financial Evolution</h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold mt-1">Spending history for the last 6 months.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-[10px] text-zinc-400 font-black uppercase">Spending</span>
                        </div>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={NEON_PURPLE} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={NEON_PURPLE} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} vertical={false} opacity={isDark ? 0.3 : 0.5} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDark ? '#666' : '#999', fontSize: 11, fontWeight: 'bold' }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDark ? '#666' : '#999', fontSize: 11, fontWeight: 'bold' }}
                                tickFormatter={(val) => formatMoney(val).split(',')[0]}
                            />
                            <Tooltip content={<CustomAreaTooltip formatMoney={formatMoney} />} cursor={{ stroke: NEON_PURPLE, strokeWidth: 1 }} />

                            <ReferenceLine y={analytics.monthlyTotal} stroke={isDark ? "#333" : "#e5e7eb"} strokeDasharray="5 5" strokeWidth={1} />

                            {/* Historical Area */}
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={NEON_PURPLE}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1000}
                                activeDot={{ r: 6, strokeWidth: 0, fill: NEON_PURPLE }}
                                name="Spending"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Section 3: Dual Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

                {/* Insights: Category & Necessity */}
                <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black">Necessity Breakdown</h4>
                        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-black">
                            {essentialPercentage}% ESSENTIAL
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-[250px] w-full md:w-1/2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={necessityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {necessityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-black uppercase">Core</span>
                                <span className="text-3xl font-black text-gray-900 dark:text-white">{essentialPercentage}%</span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            {necessityData.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{item.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold">{formatMoney(item.value)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.value / necessityData.reduce((a: any, b: any) => a + b.value, 0)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-4 italic">
                                * Executive Logic: Technical categories (Dev, Software, Hosting) are classified as Essential. Leisure and Streaming costs as Discretionary.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Insights: Calendar Heatmap */}
                <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-neutral-400 font-black">Payment Distribution</h4>
                        <span className="text-[10px] text-zinc-400 font-bold">FEBRUARY 2026</span>
                    </div>

                    <div className="grid grid-cols-7 gap-3 mb-6">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={`${day}-${i}`} className="text-center text-[10px] text-zinc-600 font-black">{day}</div>
                        ))}
                        {heatmapData.map((d, i) => {
                            let intensity = 'bg-white/5';
                            let glow = '';
                            if (d.count === 1) {
                                intensity = 'bg-purple-500/30 border border-purple-500/20';
                            } else if (d.count >= 2) {
                                intensity = 'bg-purple-500 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]';
                                glow = 'animate-pulse';
                            }

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all group relative ${intensity} ${glow}`}
                                >
                                    <span className={d.count >= 2 ? 'text-white' : 'text-gray-400 dark:text-zinc-500'}>{d.day}</span>
                                    {d.count > 0 && (
                                        <div className="absolute bottom-[-40px] left-[50%] translate-x-[-50%] p-2 bg-black border border-white/10 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap">
                                            {d.subs.map((s: any, idx: number) => (
                                                <p key={idx} className="text-[8px] text-zinc-300">{s.name}: {formatMoney(s.amount)}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-sm bg-white/5" />
                            <span className="text-[8px] text-zinc-500 font-black">NO PAYMENTS</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-sm bg-purple-500/30" />
                            <span className="text-[8px] text-zinc-500 font-black">1 PAYMENT</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-sm bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                            <span className="text-[8px] text-zinc-500 font-black">HIGH DENSITY</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Section 4: Opportunities Table */}
            <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem] overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Economy Opportunities</h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold mt-1">Services identified for potential budget optimization.</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
                        Optimization Available
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-4 text-[10px] uppercase font-black text-zinc-500 tracking-widest">Service</th>
                                <th className="pb-4 text-[10px] uppercase font-black text-zinc-500 tracking-widest">Monthly Impact</th>
                                <th className="pb-4 text-[10px] uppercase font-black text-zinc-500 tracking-widest">Annual Saving</th>
                                <th className="pb-4 text-right text-[10px] uppercase font-black text-zinc-500 tracking-widest">Suggested Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {analytics.nextRenewals.slice(0, 3).map((sub: any, i: number) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <SubscriptionLogo
                                                name={sub.name}
                                                domain={sub.website?.replace(/^https?:\/\//, '').split('/')[0]}
                                                size="md"
                                            />
                                            <span className="font-bold text-white group-hover:text-purple-400 transition-colors">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 font-bold text-zinc-300">{formatMoney(sub.amount)}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-emerald-400">-{formatMoney(sub.amount * 12)}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                                            Audit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}

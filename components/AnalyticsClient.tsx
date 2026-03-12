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
    Zap
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
import UserMenu from '@/components/UserMenu';
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

    // 2. Logic for Heatmap Grid (Dynamic Month alignment)
    const heatmapData = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Get first day of current month (0 = Sunday, 1 = Monday ...)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Get number of days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create the grid: empty slots for offset + actual days
        const grid = [];

        // Add empty slots for the offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push({ day: null, count: 0, subs: [] });
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const daySubs = analytics.nextRenewals.filter((sub: any) => {
                if (!sub.next_payment) return false;
                const d = new Date(sub.next_payment);
                return d.getDate() === i && d.getMonth() === month && d.getFullYear() === year;
            });

            grid.push({
                day: i,
                count: daySubs.length,
                subs: daySubs
            });
        }

        return grid;
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
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Finance Analytics</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Deep insights into your spending patterns and projections.</p>
                </div>
                <div className="flex items-center gap-3">
                    <UserMenu />
                </div>
            </header>

            {/* Section 1: KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Monthly Run Rate', value: formatMoney(analytics.monthlyTotal), detail: `${mrrTrend >= 0 ? '+' : ''}${formatMoney(mrrTrend)} vs last month`, icon: Wallet },
                    { label: 'Annual Projection', value: formatMoney(analytics.annualProjection), detail: 'Next 12 months forecast', icon: TrendingUp },
                    { label: 'Active Services', value: subscriptionsCount, detail: 'Total active subscriptions', icon: ShieldCheck },
                    { label: 'Avg. Cost per Sub', value: formatMoney(avgCostPerSub), detail: 'Average per active service', icon: Zap }
                ].map((kpi, i) => (
                    <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{kpi.label}</span>
                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md text-gray-400">
                                <kpi.icon size={14} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{kpi.value}</h3>
                        <p className="text-[11px] text-gray-400 font-medium uppercase">{kpi.detail}</p>
                    </motion.div>
                ))}
            </div>

            {/* Section 2: Main Evolution Chart */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg mb-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Financial Evolution</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly spending history and momentum.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
                            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Historical Spending</span>
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
                                stroke={isDark ? "#fff" : "#111"}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1000}
                                activeDot={{ r: 4, strokeWidth: 0, fill: isDark ? '#fff' : '#111' }}
                                name="Spending"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Section 3: Dual Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

                {/* Insights: Category & Necessity */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Necessity</h4>
                        <div className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
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
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase">Essential</span>
                                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{essentialPercentage}%</span>
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
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Payment Calendar</h4>
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">{formatDate(new Date(), { month: 'long', year: 'numeric' })}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-3 mb-6">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={`${day}-${i}`} className="text-center text-[10px] text-gray-400 font-medium">{day}</div>
                        ))}
                        {heatmapData.map((d, i) => {
                            if (d.day === null) {
                                return <div key={i} className="aspect-square" />;
                            }

                            let intensity = 'bg-white/5';
                            if (d.count === 1) {
                                intensity = 'bg-[#1fe2c3]/10 border border-[#1fe2c3]/20';
                            } else if (d.count >= 2) {
                                intensity = 'bg-[#1fe2c3] text-black';
                            }

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all group relative ${intensity}`}
                                >
                                    <span className={d.count >= 2 ? 'text-black' : 'text-gray-400 dark:text-zinc-500'}>{d.day}</span>
                                    {d.count > 0 && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-white dark:bg-[#0D0D0D] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 min-w-[150px]">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 pb-1 border-b border-gray-50 dark:border-white/5">
                                                Payments ({d.count})
                                            </p>
                                            <div className="space-y-2">
                                                {d.subs.map((s: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between gap-4">
                                                        <span className="text-[10px] font-bold text-gray-900 dark:text-white truncate max-w-[80px]">{s.name}</span>
                                                        <span className="text-[10px] font-black text-[#1fe2c3]">{formatMoney(s.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                            <span className="text-[9px] text-gray-400 font-medium">NO PAYMENTS</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-sm bg-gray-100 dark:bg-white/10" />
                            <span className="text-[9px] text-gray-400 font-medium">1 PAYMENT</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-sm bg-gray-900 dark:bg-white" />
                            <span className="text-[9px] text-gray-400 font-medium uppercase">Multiple</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Section 4: Opportunities Table */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Opportunities</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Audit suggestions for potential optimization.</p>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Optimization Available
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-[#222]">
                                <th className="pb-4 text-[10px] uppercase font-medium text-gray-400 tracking-wider">Service</th>
                                <th className="pb-4 text-[10px] uppercase font-medium text-gray-400 tracking-wider text-right">Impact</th>
                                <th className="pb-4 text-[10px] uppercase font-medium text-gray-400 tracking-wider text-right">Est. Save</th>
                                <th className="pb-4 text-right text-[10px] uppercase font-medium text-gray-400 tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {analytics.nextRenewals.slice(0, 3).map((sub: any, i: number) => (
                                <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <SubscriptionLogo
                                                name={sub.name}
                                                domain={sub.website?.replace(/^https?:\/\//, '').split('/')[0]}
                                                size="sm"
                                            />
                                            <span className="font-medium text-xs text-gray-900 dark:text-white">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400">{formatMoney(sub.amount)}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatMoney(sub.amount * 12)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md text-[10px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all uppercase tracking-wider">
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

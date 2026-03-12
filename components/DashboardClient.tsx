'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    CreditCard, TrendingUp, Zap, Plus, CalendarDays, ArrowRight,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { useTheme } from 'next-themes';
import { enUS } from 'date-fns/locale';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { createSubscription } from '@/lib/actions/subscriptions';
import UserMenu from '@/components/UserMenu';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { calculateYearlyProjection } from '@/lib/utils/analytics';

interface DashboardClientProps {
    subscriptions: Subscription[];
    stats: {
        monthlySpend: number;
        yearlySpend: number;
        activeCount: number;
        totalCount: number;
    };
    userCreatedAt?: string;
}

const CHART_COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#e9d5ff', '#6366f1', '#818cf8'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
};

export default function DashboardClient({ subscriptions, stats, userCreatedAt }: DashboardClientProps) {
    const router = useRouter();
    const { formatMoney } = useUser();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status') || params.get('alert');
        const error = params.get('error');

        if (status === 'deleted') {
            toast.success('Subscription deleted successfully!');
            router.replace('/dashboard');
        } else if (status === 'renewed') {
            toast.success('Subscription renewed successfully!');
            router.replace('/dashboard');
        } else if (status === 'error' || error === 'failed') {
            toast.error('Error: ' + (params.get('message') || 'Something went wrong'));
            router.replace('/dashboard');
        }
    }, [router]);

    const handleAddSubscription = async (newSub: any) => {
        setIsModalOpen(false);
        startTransition(async () => {
            const { data, error } = await createSubscription(newSub);
            if (error) {
                toast.error('Error creating subscription: ' + error);
            } else {
                toast.success('Subscription created!');
                router.refresh();
            }
        });
    };

    // --- CALCULATIONS ---
    const monthlySpend = useMemo(() => {
        return subscriptions
            .filter(s => s.status === 'active')
            .reduce((acc, sub) => {
                const monthly = sub.billing_cycle === 'yearly' ? sub.amount / 12 : sub.amount;
                return acc + monthly;
            }, 0);
    }, [subscriptions]);

    const yearlyProjection = monthlySpend * 12;

    const categoryData = useMemo(() => {
        const grouped = subscriptions
            .filter(s => s.status === 'active')
            .reduce((acc, sub) => {
                const cat = sub.category || 'Other';
                const monthly = sub.billing_cycle === 'yearly' ? sub.amount / 12 : sub.amount;
                acc[cat] = (acc[cat] || 0) + monthly;
                return acc;
            }, {} as Record<string, number>);

        const totalValue = Object.values(grouped).reduce((a, b) => a + b, 0);

        return Object.entries(grouped)
            .map(([name, value]) => ({
                name,
                value,
                percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
            }))
            .sort((a, b) => b.value - a.value);
    }, [subscriptions]);

    const monthlyChartData = useMemo(() => {
        const data = calculateYearlyProjection(subscriptions, userCreatedAt);
        // Map to match the names expected by the chart if necessary
        // In utility it's 'month', here chart uses 'name'
        return data.map(d => ({
            name: d.month,
            value: d.total,
            isFuture: d.isFuture
        }));
    }, [subscriptions, userCreatedAt]);

    const upcomingRenewals = useMemo(() => {
        return subscriptions
            .filter(s => s.status === 'active' && s.next_payment)
            .sort((a, b) => new Date(a.next_payment!).getTime() - new Date(b.next_payment!).getTime())
            .slice(0, 4);
    }, [subscriptions]);

    const formatRenewalDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        const days = differenceInDays(date, new Date());
        if (days < 7) return `In ${days} days`;
        return format(date, 'dd MMM', { locale: enUS });
    };

    const userName = 'Subscriber';

    return (
        <div className="text-zinc-900 dark:text-white transition-colors duration-300">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">Summary of your active subscriptions and spending.</p>
                </div>
                <div className="flex items-center gap-3">
                    <UserMenu />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        <Plus size={16} />
                        Add Subscription
                    </button>
                </div>
            </motion.header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Spend</span>
                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md text-gray-400">
                            <CreditCard size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatMoney(monthlySpend)}</p>
                    <p className="text-[11px] text-gray-400 mt-2 uppercase font-medium">{stats.activeCount} active items</p>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yearly Projection</span>
                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md text-gray-400">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatMoney(yearlyProjection)}</p>
                    <p className="text-[11px] text-gray-400 mt-2 uppercase font-medium">Monthly x 12</p>
                </motion.div>

                <motion.div
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                >
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Status</span>
                        <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-md text-gray-400">
                            <Zap size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeCount}</p>
                    <p className="text-[11px] text-gray-400 mt-2 uppercase font-medium">of {stats.totalCount} items</p>
                </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Bar Chart - 2/3 */}
                <motion.div
                    custom={3}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                >
                    <div className="mb-8">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Spending Projection</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly spending evolution and forecasts.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} vertical={false} opacity={isDark ? 0.3 : 0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 11, fontWeight: 'bold' }}
                                    tickFormatter={(v) => v.replace('.', '').toUpperCase()}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 11 }}
                                    tickFormatter={(v) => formatMoney(v).split(',')[0]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: isDark ? '#0D0D0D' : '#fff',
                                        border: isDark ? '1px solid #222' : '1px solid #eee',
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(10px)',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    formatter={(value) => [formatMoney(Number(value) || 0), 'Estimated Spend']}
                                    labelStyle={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isDark ? "#fff" : "#111"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={1000}
                                    activeDot={{ r: 4, strokeWidth: 0, fill: isDark ? '#fff' : '#111' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    custom={4}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">By Category</h4>
                        <PieChartIcon size={14} className="text-gray-400" />
                    </div>

                    <div className="flex flex-col flex-1 gap-8">
                        <div className="h-48 relative">
                            {categoryData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={85}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background: isDark ? '#111' : '#fff',
                                                    border: isDark ? '1px solid #222' : '1px solid #eee',
                                                    borderRadius: '12px',
                                                    color: isDark ? '#fff' : '#000'
                                                }}
                                                formatter={(value) => [formatMoney(Number(value) || 0), 'Spend']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase">Total</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatMoney(categoryData.reduce((acc, curr) => acc + curr.value, 0)).split(',')[0]}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">No active subscriptions</p>
                                </div>
                            )}
                        </div>

                        {/* Custom Legend with Progress Bars */}
                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {categoryData.map((item, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-tight">{item.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium tracking-widest">
                                            {item.percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Renewals */}
            <motion.div
                custom={5}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 lg:p-8 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">Upcoming Renewals</h3>
                    </div>
                    <Link
                        href="/subscriptions"
                        className="text-[11px] font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                        View All <ArrowRight size={12} />
                    </Link>
                </div>

                {upcomingRenewals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {upcomingRenewals.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-3 p-3 rounded-md bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-[#333] transition-all"
                            >
                                <SubscriptionLogo
                                    name={sub.name}
                                    domain={sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                    size="sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate text-gray-900 dark:text-white">{sub.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase">{formatRenewalDate(sub.next_payment!)}</p>
                                </div>
                                <span className="text-xs font-semibold text-gray-900 dark:text-white shrink-0">
                                    {formatMoney(sub.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-600 text-center py-8">No upcoming renewals.</p>
                )}
            </motion.div>

            {/* Modal */}
            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSubscription}
            />
        </div>
    );
}

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
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell
} from 'recharts';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { useTheme } from 'next-themes';
import { enUS } from 'date-fns/locale';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { createSubscription } from '@/lib/actions/subscriptions';
import { ThemeToggle } from '@/components/ThemeToggle';
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

export default function DashboardClient({ subscriptions, stats }: DashboardClientProps) {
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
            toast.success('Assinatura excluída com sucesso!');
            router.replace('/dashboard');
        } else if (status === 'renewed') {
            toast.success('Assinatura renovada com sucesso!');
            router.replace('/dashboard');
        } else if (status === 'error' || error === 'failed') {
            toast.error('Erro: ' + (params.get('message') || 'Algo deu errado'));
            router.replace('/dashboard');
        }
    }, [router]);

    const handleAddSubscription = async (newSub: any) => {
        setIsModalOpen(false);
        startTransition(async () => {
            const { data, error } = await createSubscription(newSub);
            if (error) {
                toast.error('Erro ao criar assinatura: ' + error);
            } else {
                toast.success('Assinatura criada!');
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
                const cat = sub.category || 'Outros';
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
        const data = calculateYearlyProjection(subscriptions);
        // Map to match the names expected by the chart if necessary
        // In utility it's 'month', here chart uses 'name'
        return data.map(d => ({
            name: d.month,
            value: d.total
        }));
    }, [subscriptions]);

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
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Overview of your financial panel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
                    >
                        <Plus size={18} strokeWidth={3} />
                        New Subscription
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
                    className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm lg:col-span-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Monthly Spend</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">{formatMoney(monthlySpend)}</p>
                    <p className="text-xs text-zinc-600 mt-2">Based on {stats.activeCount} active subscriptions</p>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm lg:col-span-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl text-green-600 dark:text-green-400">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Yearly Projection</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">{formatMoney(yearlyProjection)}</p>
                    <p className="text-xs text-zinc-600 mt-2">Monthly x 12 months</p>
                </motion.div>

                <motion.div
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm lg:col-span-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400">
                            <Zap size={20} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Active Subscriptions</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.activeCount}</p>
                    <p className="text-xs text-zinc-600 mt-2">of {stats.totalCount} registered</p>
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
                    className="lg:col-span-2 bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Monthly Spending Projection</h4>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold mt-1">Spending evolution based on billings.</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyChartData}>
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
                                <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    custom={4}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Spending by Category</h4>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <PieChartIcon size={18} className="text-purple-500" />
                        </div>
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
                                        <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-black uppercase">Total</span>
                                        <span className="text-xl font-black text-gray-900 dark:text-white">
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
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{item.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-black tracking-widest leading-none">
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
                className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm lg:col-span-1"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                        <CalendarDays size={20} />
                    </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Upcoming Renewals</h3>
                        <Link
                            href="/subscriptions"
                            className="text-xs font-black text-purple-500 hover:text-purple-600 uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {upcomingRenewals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {upcomingRenewals.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-colors"
                            >
                                <SubscriptionLogo
                                    name={sub.name}
                                    domain={sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{sub.name}</p>
                                    <p className="text-xs text-zinc-500">{formatRenewalDate(sub.next_payment!)}</p>
                                </div>
                                <span className="text-sm font-black text-purple-400 shrink-0">
                                    {formatMoney(sub.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-600 text-center py-8">Nenhuma renovação próxima.</p>
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

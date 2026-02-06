'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CreditCard, TrendingUp, Zap, Plus, CalendarDays, ArrowRight
} from 'lucide-react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell
} from 'recharts';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { createSubscription } from '@/lib/actions/subscriptions';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

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
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }, [subscriptions]);

    const monthlyChartData = useMemo(() => {
        return MONTHS.map(month => ({ name: month, value: monthlySpend }));
    }, [monthlySpend]);

    const upcomingRenewals = useMemo(() => {
        return subscriptions
            .filter(s => s.status === 'active' && s.next_payment)
            .sort((a, b) => new Date(a.next_payment!).getTime() - new Date(b.next_payment!).getTime())
            .slice(0, 4);
    }, [subscriptions]);

    const formatRenewalDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Hoje';
        if (isTomorrow(date)) return 'Amanhã';
        const days = differenceInDays(date, new Date());
        if (days < 7) return `Em ${days} dias`;
        return format(date, 'dd MMM', { locale: ptBR });
    };

    const userName = 'Assinante';

    return (
        <div className="text-white">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Olá, <span className="text-purple-500">{userName}</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Visão geral do seu painel financeiro.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                    <Plus size={18} strokeWidth={3} />
                    Nova Assinatura
                </button>
            </motion.header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gasto Mensal</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white">{formatMoney(monthlySpend)}</p>
                    <p className="text-xs text-zinc-600 mt-2">Baseado em {stats.activeCount} assinaturas ativas</p>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-green-500/30 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Projeção Anual</span>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-green-400">{formatMoney(yearlyProjection)}</p>
                    <p className="text-xs text-zinc-600 mt-2">Mensal x 12 meses</p>
                </motion.div>

                <motion.div
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Assinaturas Ativas</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Zap size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-orange-400">{stats.activeCount}</p>
                    <p className="text-xs text-zinc-600 mt-2">de {stats.totalCount} registradas</p>
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
                    className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-6">Projeção de Gastos Mensais</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyChartData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                                <Tooltip
                                    contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}
                                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    formatter={(value) => [formatMoney(Number(value) || 0), 'Gasto']}
                                />
                                <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Donut Chart - 1/3 */}
                <motion.div
                    custom={4}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-bold mb-6">Gastos por Categoria</h3>
                    <div className="h-64 flex items-center justify-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}
                                        formatter={(value) => [formatMoney(Number(value) || 0), 'Gasto']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-zinc-600 text-sm">Nenhuma categoria disponível</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Renewals */}
            <motion.div
                custom={5}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <CalendarDays size={20} className="text-purple-500" />
                        <h3 className="text-lg font-bold">Próximas Renovações</h3>
                    </div>
                    <a href="/subscriptions" className="text-xs font-bold text-purple-500 hover:underline flex items-center gap-1">
                        Ver todas <ArrowRight size={14} />
                    </a>
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

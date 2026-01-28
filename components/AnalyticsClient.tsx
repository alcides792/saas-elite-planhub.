'use client';

import { DollarSign, TrendingUp, Calendar, Package } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { formatDate } from '@/lib/utils/analytics';
import { RealCategoryChart } from '@/components/RealCategoryChart';
import { RealMonthlyTrendChart } from '@/components/RealMonthlyTrendChart';
import SubscriptionLogo from '@/components/ui/subscription-logo';

interface AnalyticsClientProps {
    analytics: any;
    realNextRenewal: any;
    subscriptionsCount: number;
    monthlyTrendData: any[];
    categoryData: any[];
}

export default function AnalyticsClient({
    analytics,
    realNextRenewal,
    subscriptionsCount,
    monthlyTrendData,
    categoryData
}: AnalyticsClientProps) {
    const { formatMoney } = useUser();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2 text-zinc-900 dark:text-white">Analytics</h1>
                <p className="text-zinc-500 dark:text-zinc-300 font-medium">
                    Detailed analysis of your spending and trends • {subscriptionsCount} active subscription{subscriptionsCount !== 1 ? 's' : ''}
                </p>
            </header>

            <div className="space-y-12">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Monthly Total */}
                    <div className="plan-hub-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <DollarSign size={18} strokeWidth={2.5} />
                            </div>
                            {analytics.monthlyTotal > 0 && (
                                <span className="text-xs font-black text-indigo-500 flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    Monthly
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300 mb-1">
                            Total Monthly Spending
                        </p>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                            {formatMoney(analytics.monthlyTotal)}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mt-2">
                            {formatMoney(analytics.annualProjection)}/year
                        </p>
                    </div>

                    {/* Most Expensive */}
                    <div className="plan-hub-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <TrendingUp size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300 mb-1">
                            Highest Spending
                        </p>
                        {analytics.mostExpensive ? (
                            <>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                                    {formatMoney(analytics.mostExpensive.amount)}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <SubscriptionLogo
                                        name={analytics.mostExpensive.name}
                                        domain={analytics.mostExpensive.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                        size="sm"
                                    />
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                                        {analytics.mostExpensive.name}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">---</h3>
                        )}
                    </div>

                    {/* Next Renewal */}
                    <div className="plan-hub-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                                <Calendar size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300 mb-1">
                            Next Renewal
                        </p>
                        {realNextRenewal ? (
                            <>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                                    {formatDate(realNextRenewal.date)}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <SubscriptionLogo
                                        name={realNextRenewal.name}
                                        domain={realNextRenewal.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                        size="sm"
                                    />
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                                        {realNextRenewal.name} • {formatMoney(realNextRenewal.amount)}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">---</h3>
                        )}
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <div className="plan-hub-card p-8">
                        <h4 className="text-xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-white">
                            Spending Trend
                        </h4>
                        <RealMonthlyTrendChart data={monthlyTrendData} currency={analytics.currency} />
                    </div>

                    <div className="plan-hub-card p-8">
                        <h4 className="text-xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-white">
                            Category Distribution
                        </h4>
                        <RealCategoryChart data={categoryData} currency={analytics.currency} />
                    </div>
                </div>

                {/* Upcoming Renewals */}
                <div className="plan-hub-card p-8">
                    <h4 className="text-xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-white">
                        Upcoming Renewals
                    </h4>
                    <div className="space-y-3">
                        {analytics.nextRenewals.length > 0 ? (
                            analytics.nextRenewals.map((sub: any) => {
                                const domain = sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

                                return (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between p-4 bg-gray-500/5 dark:bg-white/5 rounded-xl hover:bg-gray-500/10 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 flex flex-col items-center justify-center text-indigo-500 font-black text-[10px] leading-tight min-w-[60px]">
                                                <span>{new Date(sub.renewal_date).toLocaleDateString('pt-PT', { day: '2-digit' })}</span>
                                                <span className="uppercase">{new Date(sub.renewal_date).toLocaleDateString('pt-PT', { month: 'short' })}</span>
                                            </div>
                                            <SubscriptionLogo
                                                name={sub.name}
                                                domain={domain}
                                                size="md"
                                            />
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">{sub.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize">
                                                    {sub.category || 'other'} • {sub.billing_type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-zinc-900 dark:text-white">
                                                {formatMoney(sub.amount)}
                                            </p>
                                            <p className="text-xs text-zinc-400 font-medium">
                                                {formatDate(sub.renewal_date)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-sm font-bold">No upcoming renewals found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Annual Projection Card */}
                <div className="plan-hub-card p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">
                                Annual Projection
                            </p>
                            <h3 className="text-5xl font-black text-zinc-900 dark:text-white mb-2">
                                {formatMoney(analytics.annualProjection)}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                                Based on your {subscriptionsCount} active subscription{subscriptionsCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <TrendingUp size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

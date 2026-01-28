'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { MonthlyTrendData } from '@/lib/utils/analytics';

interface RealMonthlyTrendChartProps {
    data: MonthlyTrendData[];
    currency: string;
}

export function RealMonthlyTrendChart({ data, currency }: RealMonthlyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center opacity-50">
                <p className="text-sm font-bold text-dim">Sem dados históricos disponíveis</p>
            </div>
        );
    }

    // Mark the current month
    const now = new Date();
    const currentMonthName = now.toLocaleDateString('pt-PT', { month: 'short' });

    const chartData = data.map(item => ({
        ...item,
        isCurrent: item.month === currentMonthName && !item.isFuture,
    }));

    // Custom tooltip with Plan Hub styling
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-indigo-950 text-white p-4 rounded-xl shadow-2xl border border-purple-500/30">
                    <p className="text-xs font-bold mb-2 text-purple-300">{data.month}</p>
                    <p className="text-lg font-black mb-1">
                        {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency,
                        }).format(data.total)}
                    </p>
                    <p className="text-xs text-gray-400">
                        {data.subscriptionCount} assinatura{data.subscriptionCount !== 1 ? 's' : ''}
                    </p>
                    {data.isFuture && (
                        <p className="text-xs text-amber-400 mt-1">📊 Projeção</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="planHubGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="pastGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(value) =>
                            new Intl.NumberFormat('pt-PT', {
                                style: 'currency',
                                currency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(value)
                        }
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                    <Bar
                        dataKey="total"
                        radius={[8, 8, 0, 0]}
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry.isFuture
                                        ? 'url(#futureGradient)'
                                        : entry.isCurrent
                                            ? 'url(#planHubGradient)'
                                            : 'url(#pastGradient)'
                                }
                                opacity={entry.isFuture ? 0.5 : 1}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

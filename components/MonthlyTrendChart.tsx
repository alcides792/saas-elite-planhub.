'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MonthlyTrendChartProps {
    monthlyTotal: number;
    currency: string;
}

export function MonthlyTrendChart({ monthlyTotal, currency }: MonthlyTrendChartProps) {
    // Generate mock data for last 6 months (in a real app, this would come from database)
    const generateMockData = () => {
        const months = ['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'];
        const baseAmount = monthlyTotal;

        return months.map((month, index) => ({
            month,
            amount: baseAmount * (0.7 + Math.random() * 0.6), // Variation between 70% and 130%
            isLatest: index === months.length - 1,
        }));
    };

    const data = generateMockData();

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-indigo-950 text-white p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-bold mb-1">{payload[0].payload.month}</p>
                    <p className="text-sm font-black">
                        {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency,
                        }).format(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                        dataKey="amount"
                        radius={[8, 8, 0, 0]}
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isLatest ? 'url(#colorGradient)' : '#c4b5fd'}
                            />
                        ))}
                    </Bar>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryColor } from '@/lib/utils/analytics';

interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
}

interface SpendingChartProps {
    data: CategoryData[];
    currency: string;
}

export function SpendingChart({ data, currency }: SpendingChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center opacity-50">
                <p className="text-sm font-bold text-dim">Sem dados suficientes para o gráfico</p>
            </div>
        );
    }

    // Transform data for Recharts
    const chartData = data.map((item) => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        value: item.amount,
        percentage: item.percentage,
        fill: getCategoryColor(item.category),
    }));

    // Custom label for pie chart
    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        if (percent < 0.05) return null; // Don't show label if less than 5%

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-black">{payload[0].name}</p>
                    <p className="text-sm text-black">
                        {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency,
                        }).format(payload[0].value)}
                    </p>
                    <p className="text-xs text-slate-800">
                        {payload[0].payload.percentage.toFixed(1)}% do total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                            <span className="text-sm font-semibold text-black">
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

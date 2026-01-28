'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryData } from '@/lib/utils/analytics';

interface RealCategoryChartProps {
    data: CategoryData[];
    currency: string;
}

export function RealCategoryChart({ data, currency }: RealCategoryChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center opacity-50">
                <p className="text-sm font-bold text-dim">Sem dados de categoria disponíveis</p>
            </div>
        );
    }

    // Transform data with proper name field for legend
    const chartData = data.map((item) => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        value: item.amount,
        category: item.category,
        percentage: item.percentage,
        color: item.color,
    }));

    // Custom label - only show if percentage > 5%
    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        if (percent < 0.05) return null;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-black drop-shadow-lg"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    className="p-4 rounded-xl shadow-2xl border-2"
                    style={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        borderColor: data.color,
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.color }}
                        />
                        <p className="font-bold text-white capitalize">{data.category}</p>
                    </div>
                    <p className="text-xl font-black text-white mb-1">
                        {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency,
                        }).format(data.value)}
                    </p>
                    <p className="text-sm" style={{ color: data.color }}>
                        {data.percentage.toFixed(1)}% do total
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom legend - show category names
    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white/70 transition-colors cursor-pointer"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs font-bold text-indigo-950 capitalize">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={60}
                        dataKey="value"
                        nameKey="name"
                        animationBegin={0}
                        animationDuration={800}
                        paddingAngle={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.color}
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        content={renderLegend}
                        verticalAlign="bottom"
                        height={50}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

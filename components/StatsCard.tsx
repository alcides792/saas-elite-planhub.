'use client';

import { motion } from 'framer-motion';
import type { StatsCardProps } from '@/types';

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    trendUp = true,
    className = '',
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`plan-hub-card stat-card p-6 ${className}`}
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    {icon}
                </div>
                {trend && (
                    <span
                        className={`text-[10px] font-black px-2 py-1 rounded-md ${trendUp
                            ? 'text-emerald-500 bg-emerald-500/10'
                            : 'text-red-500 bg-red-500/10'
                            }`}
                    >
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1 relative z-10">
                {title}
            </p>
            <h3 className="text-4xl font-black relative z-10 text-zinc-900 dark:text-white">{value}</h3>
        </motion.div>
    );
}

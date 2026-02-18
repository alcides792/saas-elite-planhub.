'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Pause, Trash2, Edit3, Plus, Search } from 'lucide-react';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { format as formatDate } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface SubscriptionListProps {
    subscriptions: Subscription[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPause?: (id: string) => void;
    onAddFirst?: () => void;
}

export default function SubscriptionList({
    subscriptions,
    onEdit,
    onDelete,
    onPause,
    onAddFirst
}: SubscriptionListProps) {
    const { formatMoney } = useUser();

    const getCategoryStyles = (category: string) => {
        const styles: Record<string, string> = {
            streaming: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
            productivity: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            software: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
            gaming: 'bg-green-500/10 text-green-500 border-green-500/20',
            health: 'bg-red-500/10 text-red-500 border-red-500/20',
            other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        };
        const cat = category?.toLowerCase() || 'other';
        return styles[cat] || styles.other;
    };

    if (subscriptions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 bg-white/70 dark:bg-[#0A0A0A]/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-3xl text-center"
            >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6">
                    <Search size={40} className="text-purple-500/50" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No subscriptions found</h3>
                <p className="text-gray-500 dark:text-neutral-400 mb-8 max-w-sm">
                    Start managing your finances right now by adding your first subscription.
                </p>
                <button
                    onClick={onAddFirst}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Create First Subscription</span>
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-3">
            {subscriptions.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center justify-between p-4 bg-white/70 dark:bg-[#0A0A0A]/60 border border-gray-200 dark:border-white/5 hover:border-purple-500/30 hover:bg-white dark:hover:bg-black transition-all cursor-pointer rounded-2xl group"
                >
                    {/* 1. Logo & Info */}
                    <div className="flex items-center gap-4 flex-[2]">
                        <div className="relative">
                            <SubscriptionLogo
                                name={sub.name}
                                domain={sub.website ? new URL(sub.website).hostname : undefined}
                                size="md"
                                iconColor={sub.iconColor || undefined}
                            />
                            {sub.status === 'paused' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-neutral-900 rounded-full" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{sub.name}</h4>
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getCategoryStyles(sub.category)}`}>
                                {sub.category}
                            </span>
                        </div>
                    </div>

                    {/* 2. Custo */}
                    <div className="flex-1 text-center hidden sm:block">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {formatMoney(sub.amount)}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-neutral-400 uppercase font-bold tracking-tighter">
                            {sub.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                        </p>
                    </div>

                    {/* 3. Ciclo / Vencimento */}
                    <div className="flex-1 text-right hidden md:block px-4">
                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                            {sub.next_payment ? (
                                <>Renews on <span className="text-gray-900 dark:text-white font-medium">{formatDate(new Date(sub.next_payment), 'dd MMM', { locale: enUS })}</span></>
                            ) : (
                                'No date'
                            )}
                        </p>
                    </div>

                    {/* 4. Ações */}
                    <div className="flex items-center gap-2">
                        <div className="relative group/actions">
                            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                <MoreVertical size={20} />
                            </button>

                            {/* Dropdown context menu */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-50 p-1.5 backdrop-blur-xl">
                                <button
                                    onClick={() => onEdit?.(sub.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => onPause?.(sub.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Pause size={16} />
                                    {sub.status === 'active' ? 'Pause' : 'Resume'}
                                </button>
                                <div className="h-px bg-white/5 my-1" />
                                <button
                                    onClick={() => onDelete?.(sub.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

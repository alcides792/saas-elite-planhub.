'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Pause, Trash2, Edit3, Plus, Search } from 'lucide-react';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { format as formatDate } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

    if (subscriptions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg text-center"
            >
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Search size={20} className="text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No subscriptions found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                    Start tracking your expenses by adding your first subscription.
                </p>
                <button
                    onClick={onAddFirst}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} />
                    <span>Add Subscription</span>
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg overflow-hidden shadow-sm dark:shadow-none">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] border-b border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#0a0a0a]/50 px-6 py-3">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Subscription</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Category</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Price</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Next Payment</span>
                <span className="sr-only">Actions</span>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-100 dark:divide-[#222]">
                {subscriptions.map((sub, index) => (
                    <motion.div
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_80px] items-center px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                        onClick={() => onEdit?.(sub.id)}
                    >
                        {/* Column 1: Info */}
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <SubscriptionLogo
                                    name={sub.name}
                                    domain={sub.website ? new URL(sub.website).hostname : undefined}
                                    size="sm"
                                    iconColor={sub.iconColor || undefined}
                                />
                                {sub.status === 'paused' && (
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-[#111] rounded-full" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{sub.name}</h4>
                                <span className="md:hidden text-[10px] text-gray-500 font-medium uppercase tracking-tight">
                                    {sub.category} • {sub.billing_cycle}
                                </span>
                            </div>
                        </div>

                        {/* Column 2: Category */}
                        <div className="hidden md:block">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                                {sub.category}
                            </span>
                        </div>

                        {/* Column 3: Price */}
                        <div className="md:text-right md:px-0 mt-2 md:mt-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatMoney(sub.amount)}
                                <span className="text-[10px] text-gray-400 font-normal uppercase ml-1">
                                    /{sub.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                                </span>
                            </p>
                        </div>

                        {/* Column 4: Date */}
                        <div className="md:text-right hidden md:block">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {sub.next_payment ? (
                                    formatDate(new Date(sub.next_payment), 'MMM dd, yyyy', { locale: enUS })
                                ) : (
                                    <span className="italic opacity-50">Not set</span>
                                )}
                            </p>
                        </div>

                        {/* Column 5: Actions */}
                        <div className="flex justify-end pt-4 md:pt-0" onClick={(e) => e.stopPropagation()}>
                            <div className="relative group/actions">
                                <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                                    <MoreVertical size={16} />
                                </button>

                                {/* Dropdown menu */}
                                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-md shadow-lg opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-50 p-1 pointer-events-none group-hover/actions:pointer-events-auto">
                                    <button
                                        onClick={() => onEdit?.(sub.id)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
                                    >
                                        <Edit3 size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onPause?.(sub.id)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
                                    >
                                        <Pause size={12} />
                                        {sub.status === 'active' ? 'Pause' : 'Resume'}
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                                    <button
                                        onClick={() => onDelete?.(sub.id)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

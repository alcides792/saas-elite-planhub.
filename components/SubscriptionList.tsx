'use client';

import { motion } from 'framer-motion';
import { MoreVertical, ExternalLink, Pause, Trash2 } from 'lucide-react';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { useUser } from '@/contexts/UserContext';

interface SubscriptionListProps {
    subscriptions: Subscription[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPause?: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete, onPause }: SubscriptionListProps) {
    const { formatMoney, preferences } = useUser();
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            streaming: 'bg-pink-500/10 text-pink-500',
            productivity: 'bg-blue-500/10 text-blue-500',
            cloud: 'bg-purple-500/10 text-purple-500',
            gaming: 'bg-green-500/10 text-green-500',
            education: 'bg-yellow-500/10 text-yellow-500',
            other: 'bg-gray-500/10 text-gray-500',
        };
        return colors[category] || colors.other;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'active') {
            return <span className="smart-badge badge-saving">Active</span>;
        }
        if (status === 'paused') {
            return <span className="smart-badge badge-overlap">Paused</span>;
        }
        return <span className="smart-badge bg-red-500/20 text-red-500">Cancelled</span>;
    };

    if (subscriptions.length === 0) {
        return (
            <div className="plan-hub-card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-500/10 backdrop-blur-md dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-400 dark:text-zinc-500"
                    >
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                </div>
                <h3 className="text-xl font-black mb-2 text-zinc-900 dark:text-white">No Subscriptions</h3>
                <p className="text-sm text-dim font-medium">
                    Add your first subscription to start managing your fleet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {subscriptions.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="plan-hub-card p-6 hover:border-indigo-500/30 transition-all group relative !overflow-visible hover:z-[100]"
                >
                    <div className="flex items-start justify-between">
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                            {/* Logo - Using new SubscriptionLogo component */}
                            <SubscriptionLogo
                                name={sub.name}
                                domain={sub.website ? new URL(sub.website).hostname : undefined}
                                size="md"
                                iconColor={sub.iconColor || undefined}
                            />

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-lg text-zinc-900 dark:text-white">{sub.name}</h3>
                                    {sub.website && (
                                        <a
                                            href={sub.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-dim hover:text-indigo-500 transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${getCategoryColor(sub.category)}`}>
                                        {sub.category}
                                    </span>
                                    {getStatusBadge(sub.status)}
                                    {sub.paymentMethod && (
                                        <span className="text-xs text-dim font-medium">{sub.paymentMethod}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Amount & Actions */}
                        <div className="flex items-start gap-4">
                            <div className="text-right">
                                <p className="text-2xl font-black text-zinc-900 dark:text-white">
                                    {formatMoney(sub.amount)}
                                </p>
                                <p className="text-xs text-dim font-bold uppercase">
                                    {sub.billingType === 'monthly' && 'Monthly'}
                                    {sub.billingType === 'yearly' && 'Yearly'}
                                    {sub.billingType === 'weekly' && 'Weekly'}
                                    {sub.billingType === 'quarterly' && 'Quarterly'}
                                </p>
                                {sub.renewalDate && (
                                    <p className="text-xs text-dim font-medium mt-1">
                                        Renews: {new Date(sub.renewalDate).toLocaleDateString(preferences.language)}
                                    </p>
                                )}
                            </div>

                            {/* Actions Menu */}
                            <div className="relative group/menu">
                                <button
                                    type="button"
                                    className="w-8 h-8 rounded-lg bg-gray-500/10 backdrop-blur-md hover:bg-gray-500/20 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-400"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[110] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(sub.id);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm font-medium transition-colors text-zinc-900 dark:text-white flex items-center gap-2"
                                        >
                                            <ExternalLink size={14} />
                                            Edit
                                        </button>
                                    )}
                                    {onPause && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPause(sub.id);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm font-medium transition-colors flex items-center gap-2 text-zinc-900 dark:text-white"
                                        >
                                            <Pause size={14} />
                                            {sub.status === 'active' ? 'Pause' : 'Reactivate'}
                                        </button>
                                    )}
                                    <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Are you sure you want to delete this subscription?')) {
                                                    onDelete(sub.id);
                                                }
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-bold transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import type { Subscription } from '@/types';
import { createSubscription, deleteSubscription, toggleSubscriptionStatus } from '@/lib/actions/subscriptions';
import { useUser } from '@/contexts/UserContext';

interface SubscriptionsClientProps {
    initialSubscriptions: Subscription[];
}

export default function SubscriptionsClient({ initialSubscriptions }: SubscriptionsClientProps) {
    const router = useRouter();
    const { formatMoney } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isPending, startTransition] = useTransition();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

    // Update local state when initialSubscriptions changes (after router.refresh())
    useEffect(() => {
        setSubscriptions(initialSubscriptions);
    }, [initialSubscriptions]);

    const handleAddSubscription = async (newSub: any) => {
        setIsModalOpen(false);

        startTransition(async () => {
            const { data, error } = await createSubscription(newSub);
            if (error) {
                console.error('Error creating subscription:', error);
                alert('Error creating subscription: ' + error);
            } else {
                // Refresh to get updated data from server
                router.refresh();
            }
        });
    };

    const handleDeleteSubscription = async (id: string) => {
        startTransition(async () => {
            const { success, error } = await deleteSubscription(id);
            if (error) {
                console.error('Error deleting subscription:', error);
                alert('Error deleting subscription: ' + error);
            } else {
                router.refresh();
            }
        });
    };

    const handlePauseSubscription = async (id: string) => {
        startTransition(async () => {
            const { data, error } = await toggleSubscriptionStatus(id);
            if (error) {
                console.error('Error toggling subscription:', error);
                alert('Error changing status: ' + error);
            } else {
                router.refresh();
            }
        });
    };

    const handleEditSubscription = (id: string) => {
        // Navigation or Modal for editing
        router.push(`/subscriptions?edit=${id}`);
    };

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const subCategory = (sub.category || 'other').toLowerCase();
        const matchesCategory = filterCategory === 'all' || subCategory === filterCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const totalMonthly = subscriptions.reduce((total, sub) => {
        if (sub.status !== 'active') return total;
        switch (sub.billingType) {
            case 'monthly': return total + sub.amount;
            case 'yearly': return total + (sub.amount / 12);
            case 'quarterly': return total + (sub.amount / 3);
            case 'weekly': return total + (sub.amount * 4.33);
            default: return total + sub.amount;
        }
    }, 0);

    const totalYearly = totalMonthly * 12;

    const activeCount = subscriptions.filter(sub => sub.status === 'active').length;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-2 leading-none text-zinc-900 dark:text-white">
                            Subscriptions.
                        </h1>
                        <p className="text-xl font-medium text-zinc-900 dark:text-zinc-400">
                            Manage all your subscriptions in one place
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>New Subscription</span>
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="plan-hub-card p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-dim mb-1">
                            Monthly Spend
                        </p>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{formatMoney(totalMonthly)}</h3>
                    </div>
                    <div className="plan-hub-card p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-dim mb-1">
                            Annual Spend
                        </p>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{formatMoney(totalYearly)}</h3>
                    </div>
                    <div className="plan-hub-card p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-dim mb-1">
                            Active Subscriptions
                        </p>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{activeCount}</h3>
                    </div>
                </div>
            </header>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                    />
                    <input
                        type="text"
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="plan-hub-input rounded-xl pl-12 pr-4 py-3 text-sm font-medium"
                    />
                </div>
                <div className="relative">
                    <Filter
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="plan-hub-input rounded-xl pl-12 pr-8 py-3 text-sm font-medium"
                    >
                        <option value="all">All Categories</option>
                        <option value="streaming">Streaming</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="music">Music</option>
                        <option value="software">Software</option>
                        <option value="productivity">Productivity</option>
                        <option value="gaming">Gaming</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Subscriptions List */}
            {isPending && (
                <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-600 font-medium">
                    Updating...
                </div>
            )}

            <SubscriptionList
                subscriptions={filteredSubscriptions}
                onEdit={handleEditSubscription}
                onDelete={handleDeleteSubscription}
                onPause={handlePauseSubscription}
            />

            {/* Add Subscription Modal */}
            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSubscription}
            />
        </div>
    );
}

'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Wallet, TrendingUp, Layers, ChevronDown } from 'lucide-react';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import type { Subscription } from '@/types';
import ProModal from '@/components/ProModal';
import { createSubscription, deleteSubscription, toggleSubscriptionStatus } from '@/lib/actions/subscriptions';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface SubscriptionsClientProps {
    initialSubscriptions: Subscription[];
}

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc';

export default function SubscriptionsClient({ initialSubscriptions }: SubscriptionsClientProps) {
    const router = useRouter();
    const { formatMoney } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [isPending, startTransition] = useTransition();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

    useEffect(() => {
        setSubscriptions(initialSubscriptions);
    }, [initialSubscriptions]);

    const handleAddSubscription = async (newSub: any) => {
        setIsModalOpen(false);
        startTransition(async () => {
            const { error } = await createSubscription(newSub);
            if (error) {
                if (error.includes("Blocked") || error.includes("Pro")) {
                    setIsProModalOpen(true);
                } else {
                    toast.error('Error creating subscription: ' + error);
                }
            } else {
                toast.success('Subscription created successfully!');
                router.refresh();
            }
        });
    };

    const handleDeleteSubscription = async (id: string) => {
        startTransition(async () => {
            const { error } = await deleteSubscription(id);
            if (error) {
                toast.error('Error deleting subscription: ' + error);
            } else {
                toast.success('Subscription deleted!');
                router.refresh();
            }
        });
    };

    const handlePauseSubscription = async (id: string) => {
        startTransition(async () => {
            const { error } = await toggleSubscriptionStatus(id);
            if (error) {
                toast.error('Error changing status: ' + error);
            } else {
                toast.success('Status updated!');
                router.refresh();
            }
        });
    };

    const handleEditSubscription = (id: string) => {
        router.push(`/subscriptions?edit=${id}`);
    };

    const processedSubscriptions = useMemo(() => {
        let filtered = subscriptions.filter(sub => {
            const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
            const subCategory = (sub.category || 'other').toLowerCase();
            const matchesCategory = filterCategory === 'all' || subCategory === filterCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.amount - b.amount;
                case 'price-desc': return b.amount - a.amount;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'oldest': return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                case 'newest':
                default: return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            }
        });
    }, [subscriptions, searchQuery, filterCategory, sortBy]);

    const stats = useMemo(() => {
        const monthly = subscriptions.reduce((total, sub) => {
            if (sub.status !== 'active') return total;
            return sub.billing_cycle === 'yearly' ? total + (sub.amount / 12) : total + sub.amount;
        }, 0);

        return {
            monthly,
            yearly: monthly * 12,
            total: subscriptions.length
        };
    }, [subscriptions]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header & Ações */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">My Subscriptions</h1>
                    <p className="text-zinc-400">Manage your recurring expenses and never miss a due date.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span>New Subscription</span>
                </button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-gray-900 dark:text-white">
                        <Wallet size={64} />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                        <Wallet size={16} className="text-emerald-500" /> Monthly Spending
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {formatMoney(stats.monthly)}
                    </h3>
                </div>
                <div className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-gray-900 dark:text-white">
                        <TrendingUp size={64} />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                        <Wallet size={16} className="text-purple-500" /> Yearly Spending
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {formatMoney(stats.yearly)}
                    </h3>
                </div>
                <div className="bg-white/70 dark:bg-[#0A0A0A]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-gray-900 dark:text-white">
                        <Layers size={64} />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                        <Layers size={16} className="text-blue-500" /> Total Subscriptions
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {stats.total}
                    </h3>
                </div>
            </div>

            {/* Barra de Controle (Filtros) */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="search"
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative min-w-[160px]">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full appearance-none bg-black/5 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
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
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    <div className="relative min-w-[180px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full appearance-none bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
                        >
                            <option value="newest">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="name-asc">Name: A-Z</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Subscriptions List */}
            {isPending ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <SubscriptionList
                    subscriptions={processedSubscriptions}
                    onEdit={handleEditSubscription}
                    onDelete={handleDeleteSubscription}
                    onPause={handlePauseSubscription}
                    onAddFirst={() => setIsModalOpen(true)}
                />
            )}

            <AddSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddSubscription} />
            <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
        </div>
    );
}

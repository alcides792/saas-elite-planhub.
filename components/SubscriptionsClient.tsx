'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Wallet, TrendingUp, Layers, ChevronDown } from 'lucide-react';
import PremiumSelect from '@/components/ui/PremiumSelect';
import SubscriptionList from '@/components/SubscriptionList';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import type { Subscription } from '@/types';
import ProModal from '@/components/ProModal';
import { createSubscription, deleteSubscription, toggleSubscriptionStatus } from '@/lib/actions/subscriptions';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import UserMenu from '@/components/UserMenu';

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
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header & Ações */}
            {/* Header & Actions */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-0.5">My Subscriptions</h1>
                    <p className="text-gray-500 text-sm">Manage your recurring expenses and never miss a due date.</p>
                </div>
                <div className="flex items-center gap-3">
                    <UserMenu />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        <Plus size={16} />
                        <span>Add Subscription</span>
                    </button>
                </div>
            </header>

            {/* KPIs */}
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                        <Wallet size={14} className="text-gray-400" /> Monthly Spending
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatMoney(stats.monthly)}
                    </h3>
                </div>
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp size={14} className="text-gray-400" /> Yearly Spending
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatMoney(stats.yearly)}
                    </h3>
                </div>
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                        <Layers size={14} className="text-gray-400" /> Total Items
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.total}
                    </h3>
                </div>
            </div>

            {/* Control Bar (Filters) */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="search"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border border-gray-200 dark:border-[#333] rounded-md py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <PremiumSelect
                        value={filterCategory}
                        onChange={setFilterCategory}
                        options={[
                            { value: 'all', label: 'All Categories' },
                            { value: 'streaming', label: 'Streaming' },
                            { value: 'entertainment', label: 'Entertainment' },
                            { value: 'music', label: 'Music' },
                            { value: 'software', label: 'Software' },
                            { value: 'productivity', label: 'Productivity' },
                            { value: 'gaming', label: 'Gaming' },
                            { value: 'shopping', label: 'Shopping' },
                            { value: 'health', label: 'Health' },
                            { value: 'other', label: 'Other' },
                        ]}
                        className="min-w-[170px]"
                    />
                    <PremiumSelect
                        value={sortBy}
                        onChange={(val) => setSortBy(val as SortOption)}
                        options={[
                            { value: 'newest', label: 'Most Recent' },
                            { value: 'oldest', label: 'Oldest First' },
                            { value: 'price-desc', label: 'Price: High to Low' },
                            { value: 'price-asc', label: 'Price: Low to High' },
                            { value: 'name-asc', label: 'Name: A-Z' },
                        ]}
                        className="min-w-[190px]"
                    />
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

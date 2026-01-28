'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    CreditCard, Star, TrendingUp, Wallet,
    Bot, User, Loader2, Send, AlertCircle
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import type { Subscription } from '@/types';
import { createSubscription } from '@/lib/actions/subscriptions';
import { UIMessage } from 'ai';
import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@/contexts/UserContext';

interface DashboardClientProps {
    subscriptions: Subscription[];
    stats: {
        monthlySpend: number;
        yearlySpend: number;
        activeCount: number;
        totalCount: number;
    };
}

export default function DashboardClient({ subscriptions, stats }: DashboardClientProps) {
    const router = useRouter();
    const { formatMoney, preferences } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

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

    // AI Chat Logic
    const { messages, sendMessage, error, status } = useChat();
    const [input, setInput] = useState('');
    const isLoading = status === 'streaming' || status === 'submitted';
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Calculate next billing
    const upcomingSubscriptions = subscriptions
        .filter(sub => sub.status === 'active' && sub.renewalDate)
        .sort((a, b) => {
            const dateA = new Date(a.renewalDate!).getTime();
            const dateB = new Date(b.renewalDate!).getTime();
            return dateA - dateB;
        });

    const nextBilling = upcomingSubscriptions[0];

    const categoryBreakdown = subscriptions
        .filter(sub => sub.status === 'active')
        .reduce((acc, sub) => {
            const category = sub.category || 'other';
            if (!acc[category]) {
                acc[category] = 0;
            }

            // Normalize to monthly
            let monthlyAmount = sub.amount;
            switch (sub.billingType) {
                case 'yearly': monthlyAmount = sub.amount / 12; break;
                case 'quarterly': monthlyAmount = sub.amount / 3; break;
                case 'weekly': monthlyAmount = sub.amount * 4.33; break;
            }

            acc[category] += monthlyAmount;
            return acc;
        }, {} as Record<string, number>);

    const totalSpend = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);

    // Recent activity (last 5 subscriptions)
    const recentActivity = [...subscriptions]
        .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-14">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#030305] rounded-full animate-pulse" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-wider">
                            Operational • Plan Hub
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>New Subscription</span>
                    </button>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 leading-none text-zinc-900 dark:text-white">
                    Command.
                </h1>
                <p className="text-xl font-medium text-zinc-900 dark:text-zinc-400">
                    Today • General Overview of your Plan Hub.
                </p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatsCard
                    title="Monthly Spend"
                    value={formatMoney(stats.monthlySpend)}
                    icon={<CreditCard size={18} strokeWidth={2.5} />}
                />
                <StatsCard
                    title="Active"
                    value={stats.activeCount.toString()}
                    icon={<Star size={18} strokeWidth={2.5} />}
                />
                <div className="plan-hub-card stat-card intelligence-board border-l-4 border-indigo-500 p-6">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            Plan Hub Insights
                        </p>
                        <span className="smart-badge badge-ai">Active</span>
                    </div>
                    <h3 className="text-lg font-black leading-tight mb-2 relative z-10 text-zinc-900 dark:text-white">
                        {stats.totalCount === 0
                            ? 'Add subscriptions to start analysis...'
                            : `${stats.activeCount} active subscriptions monitored`}
                    </h3>
                </div>
                <div className="premium-gradient p-8 text-white shadow-2xl relative overflow-hidden border border-white/10 rounded-xl">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                            Next Invoice
                        </p>
                        <h3 className="text-4xl font-black">
                            {nextBilling ? formatMoney(nextBilling.amount) : formatMoney(0)}
                        </h3>
                        {nextBilling && (
                            <div className="flex items-center gap-2 mt-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <SubscriptionLogo
                                    name={nextBilling.name}
                                    domain={nextBilling.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                    size="sm"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold">{nextBilling.name}</span>
                                    <span className="text-[9px] opacity-70">
                                        {new Date(nextBilling.renewalDate!).toLocaleDateString(preferences.language)}
                                    </span>
                                </div>
                            </div>
                        )}
                        {!nextBilling && (
                            <div className="flex items-center gap-2 mt-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">
                                    ?
                                </div>
                                <span className="text-[10px] font-bold">---</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Budget Overview */}
                <div className="space-y-6">
                    <div className="plan-hub-card p-8 card-hover transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">Plan Hub Budget.</h4>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black">
                                    Monthly
                                </button>
                                <button className="px-3 py-1 rounded-lg bg-white/5 text-dim text-[10px] font-bold hover:bg-white/10 transition-colors">
                                    Yearly
                                </button>
                            </div>
                        </div>
                        {Object.keys(categoryBreakdown).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(categoryBreakdown).map(([category, amount]) => {
                                    const percentage = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
                                    return (
                                        <div key={category}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold capitalize">{category}</span>
                                                <span className="text-sm font-black text-zinc-900 dark:text-white">
                                                    {formatMoney(amount)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="opacity-50 text-center py-8">
                                <p className="text-sm font-bold">No category data available</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="plan-hub-card p-8">
                        <h4 className="text-xl font-black tracking-tighter mb-8 text-zinc-900 dark:text-white">Recent Fleet.</h4>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {recentActivity.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <SubscriptionLogo
                                                name={sub.name}
                                                domain={sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                                size="sm"
                                            />
                                            <div>
                                                <p className="text-sm font-bold">{sub.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium capitalize">
                                                    {sub.category}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-black dark:text-white">
                                            {formatMoney(sub.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="opacity-50 text-center py-4 text-sm font-medium">
                                No recent activity detected.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: AI Assistant */}
                <div className="space-y-6">
                    <div className="plan-hub-card p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-all" />

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">Plan Hub Assistant.</h4>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                    Powered by Plan Hub AI
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-gray-500/10 backdrop-blur-xl border border-white/20 dark:bg-black/5 dark:bg-white/5 rounded-3xl p-6 mb-6 relative z-10 flex flex-col"
                            style={{ minHeight: '350px' }}
                        >
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-200 text-[10px] font-bold mb-4">
                                        <AlertCircle size={14} className="text-red-500" />
                                        Connection error. Check your API Key.
                                    </div>
                                )}

                                {messages.length === 0 ? (
                                    <div className="bg-indigo-500 text-white rounded-2xl rounded-tl-none p-4 max-w-[85%] animate-fade-in shadow-lg">
                                        <p className="text-sm font-medium">
                                            Welcome to Plan Hub. How can I optimize your financial hub today?
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((m: UIMessage) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-gray-500/20 backdrop-blur-md border border-white/20 dark:bg-white/10 text-zinc-900 dark:text-white rounded-tl-none'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-indigo-400" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 text-zinc-500 dark:text-zinc-400">
                                                        {m.role === 'user' ? 'You' : 'Plan Hub Assistant'}
                                                    </span>
                                                </div>
                                                <div className="text-sm leading-relaxed prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap text-black dark:text-white">
                                                    {m.parts ? (
                                                        m.parts.map((part: any, i: number) => (
                                                            part.type === 'text' ? <ReactMarkdown key={i}>{part.text}</ReactMarkdown> : null
                                                        ))
                                                    ) : (
                                                        <ReactMarkdown>{(m as any).content || ''}</ReactMarkdown>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {isLoading && (
                                    <div className="flex justify-start animate-fade-in">
                                        <div className="bg-gray-500/20 backdrop-blur-md border border-white/20 dark:bg-white/5 dark:border-white/10 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-indigo-400" />
                                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Calculating...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => setInput('Invoice Summary')}
                                    className="text-[10px] font-black px-3 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white rounded-xl transition-all"
                                >
                                    Invoice Summary
                                </button>
                                <button
                                    onClick={() => setInput('Savings Tips')}
                                    className="text-[10px] font-black px-3 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white rounded-xl transition-all"
                                >
                                    Savings Tips
                                </button>
                                <button
                                    onClick={() => setInput('Spend by Category')}
                                    className="text-[10px] font-black px-3 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white rounded-xl transition-all"
                                >
                                    Spend by Category
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleChatSubmit} className="flex gap-3 relative z-10">
                            <input
                                type="text"
                                value={input}
                                onChange={handleChatInputChange}
                                placeholder="Command your AI..."
                                className="flex-1 plan-hub-input"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
                            >
                                <Send size={20} strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>

                    {/* Next Renewals */}
                    <div className="plan-hub-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">Upcoming Subscriptions.</h4>
                            <a
                                href="/subscriptions"
                                className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline"
                            >
                                View All
                            </a>
                        </div>
                        {upcomingSubscriptions.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingSubscriptions.slice(0, 3).map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <SubscriptionLogo
                                                name={sub.name}
                                                domain={sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                                size="sm"
                                            />
                                            <div>
                                                <p className="text-sm font-bold">{sub.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                    {new Date(sub.renewalDate!).toLocaleDateString(preferences.language)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-black dark:text-white">
                                            {formatMoney(sub.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="opacity-50 text-center py-4 text-sm font-medium">
                                No upcoming renewals
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Subscription Modal */}
            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSubscription}
            />
        </div >
    );
}

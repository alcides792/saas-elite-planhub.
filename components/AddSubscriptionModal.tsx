'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Tag, CreditCard, Globe, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { POPULAR_SUBSCRIPTIONS, searchSubscriptions, type PopularSubscription } from '@/lib/subscriptions';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import { useUser } from '@/contexts/UserContext';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (subscription: any) => void;
}

export default function AddSubscriptionModal({ isOpen, onClose, onAdd }: AddSubscriptionModalProps) {
    const { formatMoney, preferences } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [showPresets, setShowPresets] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        amount: '',
        currency: preferences.currency,
        billingType: 'monthly',
        category: 'streaming',
        paymentMethod: 'card',
        renewalDate: '',
    });

    const filteredSubscriptions = searchQuery
        ? searchSubscriptions(searchQuery)
        : POPULAR_SUBSCRIPTIONS;

    const handlePresetClick = (preset: PopularSubscription) => {
        setFormData({
            ...formData,
            name: preset.name,
            website: `https://${preset.domain}`,
            amount: preset.price.toString(),
            category: preset.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
        });
        setShowPresets(false);
        setSearchQuery('');
    };

    const handleManualAdd = () => {
        setShowPresets(false);
        setSearchQuery('');
        // Clear selection
        setFormData({
            name: '',
            website: '',
            amount: '',
            currency: preferences.currency,
            billingType: 'monthly',
            category: 'streaming',
            paymentMethod: 'card',
            renewalDate: '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            amount: parseFloat(formData.amount),
            renewalDate: formData.renewalDate || null, // Convert empty string to null
            status: 'active',
        });
        onClose();
        // Reset form
        setFormData({
            name: '',
            website: '',
            amount: '',
            currency: preferences.currency,
            billingType: 'monthly',
            category: 'streaming',
            paymentMethod: 'card',
            renewalDate: '',
        });
        setShowPresets(true);
        setSearchQuery('');
    };

    const handleClose = () => {
        onClose();
        setShowPresets(true);
        setSearchQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-2xl bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 dark:border-purple-500/20 overflow-hidden flex flex-col"
                        >
                            {/* Header - Compact */}
                            <div className="p-4 border-b border-black/10 dark:border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                                        {showPresets ? 'Choose a Subscription' : 'New Subscription'}
                                    </h2>
                                    <button
                                        onClick={handleClose}
                                        className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Search Bar - More discrete */}
                                {showPresets && (
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/30" size={16} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search Netflix, Spotify, ChatGPT..."
                                            className="w-full pl-9 plan-hub-input"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {showPresets ? (
                                    <>
                                        {/* Presets List - Compact with ScrollArea */}
                                        <div className="flex-1 overflow-y-auto px-4 py-3 max-h-[400px]">
                                            <div className="space-y-1">
                                                {filteredSubscriptions.length > 0 ? (
                                                    filteredSubscriptions.map((sub, index) => (
                                                        <motion.button
                                                            key={`${sub.name}-${index}`}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.01 }}
                                                            onClick={() => handlePresetClick(sub)}
                                                            className="w-full flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent border-l-2 border-transparent hover:border-purple-500 transition-all group text-left"
                                                        >
                                                            {/* Logo - Using SubscriptionLogo component */}
                                                            <SubscriptionLogo
                                                                name={sub.name}
                                                                domain={sub.domain}
                                                                size="sm"
                                                            />

                                                            {/* Info - Compact */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                                                                    {sub.name}
                                                                </h3>
                                                                <p className="text-xs text-dim truncate">
                                                                    {sub.category}
                                                                </p>
                                                            </div>

                                                            {/* Price - Compact */}
                                                            <div className="flex-shrink-0 text-right">
                                                                <p className="text-sm font-bold text-purple-400">
                                                                    {formatMoney(sub.price)}
                                                                </p>
                                                            </div>
                                                        </motion.button>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-dim text-sm">
                                                            No subscription found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Fixed Footer - Manual Add */}
                                        <div className="border-t border-black/10 dark:border-white/10 p-3">
                                            <button
                                                onClick={handleManualAdd}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-zinc-500 dark:text-white/50 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                                            >
                                                <span>Didn't find what you're looking for?</span>
                                                <span className="flex items-center gap-1 font-semibold group-hover:gap-2 transition-all">
                                                    <Plus size={14} />
                                                    Add Manually
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* Form */
                                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
                                        <div className="space-y-4">
                                            {/* Name & Website */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        Subscription Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Netflix"
                                                        className="plan-hub-input"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        <Globe size={12} className="inline mr-1" />
                                                        Website
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={formData.website}
                                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                        placeholder="https://netflix.com"
                                                        className="plan-hub-input"
                                                    />
                                                </div>
                                            </div>

                                            {/* Amount & Currency */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        <DollarSign size={12} className="inline mr-1" />
                                                        Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        step="0.01"
                                                        value={formData.amount}
                                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                        placeholder="15.49"
                                                        className="plan-hub-input"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        Currency
                                                    </label>
                                                    <select
                                                        value={formData.currency}
                                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                        className="plan-hub-input"
                                                    >
                                                        <option value="EUR">EUR</option>
                                                        <option value="USD">USD</option>
                                                        <option value="GBP">GBP</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Billing Type & Category */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        <Calendar size={12} className="inline mr-1" />
                                                        Billing Cycle
                                                    </label>
                                                    <select
                                                        value={formData.billingType}
                                                        onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                                                        className="plan-hub-input"
                                                    >
                                                        <option value="monthly">Monthly</option>
                                                        <option value="yearly">Yearly</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        <Tag size={12} className="inline mr-1" />
                                                        Category
                                                    </label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="plan-hub-input"
                                                    >
                                                        <option value="streaming">Streaming</option>
                                                        <option value="software">Software</option>
                                                        <option value="productivity">Productivity</option>
                                                        <option value="gaming">Gaming</option>
                                                        <option value="health">Health</option>
                                                        <option value="education">Education</option>
                                                        <option value="news">News</option>
                                                        <option value="finance">Finance</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Payment Method & Renewal Date */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        <CreditCard size={12} className="inline mr-1" />
                                                        Payment Method
                                                    </label>
                                                    <select
                                                        value={formData.paymentMethod}
                                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                        className="plan-hub-input"
                                                    >
                                                        <option value="card">Credit Card</option>
                                                        <option value="paypal">PayPal</option>
                                                        <option value="bank">Bank Transfer</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-black dark:text-white/70 mb-1.5">
                                                        Renewal Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.renewalDate}
                                                        onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                                                        className="plan-hub-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowPresets(true)}
                                                className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-semibold transition-all border border-black/10 dark:border-white/10"
                                            >
                                                ← Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/20"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

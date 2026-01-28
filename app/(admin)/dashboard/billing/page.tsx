'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, CreditCard, AlertCircle, Loader2, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type BillingStatus = 'trial_pending' | 'trial_active' | 'active' | 'past_due' | 'cancelled';

interface UserProfile {
    id: string;
    billing_status: BillingStatus;
    trial_ends_at: string | null;
}

export default function BillingPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('id, billing_status, trial_ends_at')
                        .eq('id', user.id)
                        .single();

                    if (!error && data) {
                        setProfile(data as UserProfile);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [supabase]);

    const handleCheckout = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON response received:", text);
                throw new Error("Server returned an invalid response (HTML). Check your route configuration and environment variables.");
            }

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` (${data.details})` : ''}`);
            } else {
                alert('Checkout link not generated. Please check your configuration.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error instanceof Error ? error.message : 'Failed to initiate checkout. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    const benefits = [
        "Access to all premium features",
        "Generate extension tokens",
        "Priority processing",
        "Future updates included"
    ];

    const status = profile?.billing_status || 'trial_pending';

    const renderActionButton = () => {
        switch (status) {
            case 'trial_pending':
                return (
                    <button
                        onClick={handleCheckout}
                        disabled={actionLoading}
                        className="w-full py-4 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                    >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        Start Free 3-Day Trial
                    </button>
                );
            case 'trial_active':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-medium mb-1">
                                <Sparkles className="w-4 h-4" />
                                You are currently in your free trial.
                            </div>
                            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                                You will be charged $27/month after the 3-day trial unless you cancel.
                            </p>
                        </div>
                        <button
                            className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                        >
                            Manage Subscription
                        </button>
                    </div>
                );
            case 'active':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                                <ShieldCheck className="w-5 h-5" />
                                Your subscription is active 🎉
                            </div>
                        </div>
                        <button
                            className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                        >
                            Manage Subscription
                        </button>
                    </div>
                );
            case 'past_due':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl gap-2">
                            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium">
                                <AlertCircle className="w-5 h-5" />
                                Payment failed
                            </div>
                            <p className="text-sm text-center text-rose-600 dark:text-rose-400">
                                Please update your payment method to keep access.
                            </p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={actionLoading}
                            className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fix Payment'}
                        </button>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                Your subscription was cancelled.
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={actionLoading}
                            className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reactivate Plan'}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight"
                >
                    Billing & Subscription
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-500 dark:text-slate-400"
                >
                    Manage your plan and access premium features
                </motion.p>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto"
            >
                <div className="relative group">
                    {/* Shadow decoration */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Pro Plan</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Best for power users</p>
                                </div>
                                <div className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 p-2 rounded-lg">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$27</span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                            </div>
                            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-8 px-2 py-1 bg-violet-50 dark:bg-violet-900/20 inline-block rounded-md">
                                3-day free trial
                            </p>

                            <ul className="space-y-4 mb-10">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full">
                                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-300 text-sm">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            {renderActionButton()}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>Cancel anytime during trial</span>
                                <div className="flex items-center gap-1 group/link cursor-pointer">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Rocket } from 'lucide-react';
import { AVATARS } from '@/lib/constants';
import { createClient } from '@/lib/utils/supabase/client';
import { cn } from '@/lib/utils';
import PremiumSelect from '@/components/ui/PremiumSelect';
import { Globe } from 'lucide-react';

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
    { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' }
];

const currencyOptions = currencies.map(c => ({
    value: c.code,
    label: `${c.code} (${c.symbol}) - ${c.name}`
}));

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: (name: string, avatar: string) => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !selectedAvatar || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('User not found');

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: name,
                    avatar_url: selectedAvatar,
                    currency: currency
                })
                .eq('id', user.id);

            if (error) throw error;

            onComplete(name, selectedAvatar);
        } catch (error) {
            console.error('Error during onboarding:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-8"
                >
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome to Kovr
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Let&apos;s personalize your experience.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                                    What should we call you?
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1fe2c3]/50 focus:border-[#1fe2c3] transition-all"
                                    required
                                />
                            </div>

                            {/* Currency Selection */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                                    Default Currency
                                </label>
                                <PremiumSelect
                                    value={currency}
                                    onChange={setCurrency}
                                    options={currencyOptions}
                                    icon={Globe}
                                />
                            </div>

                            {/* Avatar Selection */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                                    Pick your Avatar
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
                                    {AVATARS.map((avatar) => {
                                        const isSelected = selectedAvatar === avatar;
                                        return (
                                            <button
                                                key={avatar}
                                                type="button"
                                                onClick={() => setSelectedAvatar(avatar)}
                                                className={cn(
                                                    "relative aspect-square rounded-xl overflow-hidden transition-all duration-200 group border border-transparent",
                                                    isSelected
                                                        ? "scale-105 ring-2 ring-[#1fe2c3] ring-offset-2 ring-offset-white dark:ring-offset-[#111]"
                                                        : "hover:bg-black/5 dark:hover:bg-white/5"
                                                )}
                                            >
                                                <Image
                                                    src={avatar}
                                                    alt="Avatar Option"
                                                    fill
                                                    className={cn(
                                                        "object-contain p-2",
                                                        isSelected ? "scale-110" : "group-hover:scale-110 transition-transform"
                                                    )}
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-[#1fe2c3]/10">
                                                        <div className="bg-[#1fe2c3] p-0.5 rounded-full shadow-lg">
                                                            <Check size={10} className="text-black" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={!name || !selectedAvatar || isSubmitting}
                                className={cn(
                                    "w-full bg-[#1fe2c3] text-black font-bold text-sm px-4 py-3 rounded-xl hover:opacity-90 transition-opacity mt-6 flex items-center justify-center gap-2",
                                    (!name || !selectedAvatar || isSubmitting) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Let&apos;s Go!
                                        <Rocket size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

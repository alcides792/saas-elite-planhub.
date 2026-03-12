'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/utils/supabase/client';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

export default function UserMenu() {
    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { preferences } = useUser();
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="relative">
            {/* User Avatar Trigger */}
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200 dark:border-[#333] transition-all hover:ring-2 hover:ring-gray-100 dark:hover:ring-white/10 flex items-center justify-center shrink-0 bg-gray-100 dark:bg-zinc-800",
                    showUserMenu && "ring-2 ring-gray-900 dark:ring-white"
                )}
            >
                {preferences.avatar_url ? (
                    <Image
                        src={preferences.avatar_url}
                        alt="User"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="font-medium text-gray-500 text-sm uppercase">
                        {preferences.full_name?.charAt(0) || preferences.email?.charAt(0)}
                    </span>
                )}
            </button>

            {/* Brutalist User Menu Popover */}
            <AnimatePresence>
                {showUserMenu && (
                    <>
                        {/* Backdrop to close menu */}
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="absolute top-12 right-0 z-50 w-72 bg-white dark:bg-black border border-gray-200 dark:border-[#222] p-5 shadow-lg space-y-5 rounded-lg"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                    {preferences.avatar_url ? (
                                        <Image src={preferences.avatar_url} alt="User" width={48} height={48} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-medium text-gray-500 text-xl uppercase">
                                            {preferences.full_name?.charAt(0) || preferences.email?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-semibold text-sm truncate tracking-tight text-gray-900 dark:text-white">
                                            {preferences.full_name}
                                        </p>
                                        {preferences.plan_name === 'Pro' && preferences.billing_status === 'active' && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1fe2c3]/10 text-[#1fe2c3] border border-[#1fe2c3]/20 uppercase ml-2">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 truncate">{preferences.email}</p>
                                </div>
                            </div>

                            <div className="border-b border-gray-100 dark:border-white/10" />

                            {/* Action Links */}
                            <div className="space-y-1">
                                <Link
                                    href="/settings"
                                    onClick={() => setShowUserMenu(false)}
                                    className="flex items-center gap-3 px-3 py-2 font-medium text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <Settings size={14} className="opacity-70" />
                                    Settings
                                </Link>

                                <button
                                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-3 px-3 py-2 font-medium text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors w-full"
                                >
                                    {resolvedTheme === 'dark' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-purple-600" />}
                                    Toggle Theme
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 mt-2 font-medium text-xs text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 rounded-md transition-colors"
                                >
                                    <LogOut size={14} className="opacity-70" />
                                    Sign Out
                                </button>
                            </div>

                            {/* Legal Footer */}
                            <div className="pt-4 flex flex-wrap justify-center gap-2 text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                                <Link href="/privacy-policy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors leading-none">Privacy Policy</Link>
                                <span>•</span>
                                <Link href="/terms-of-service" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors leading-none">Terms of Service</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

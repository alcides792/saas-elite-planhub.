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
                    "w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-black dark:border-white transition-transform active:scale-90 flex items-center justify-center shrink-0 bg-purple-600 shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)]",
                    showUserMenu && "scale-110"
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
                    <span className="font-bold text-white text-base uppercase">
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
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-14 right-0 z-50 w-72 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_#1fe2c3] space-y-6"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black dark:border-white bg-purple-600 flex items-center justify-center shrink-0">
                                    {preferences.avatar_url ? (
                                        <Image src={preferences.avatar_url} alt="User" width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-white text-2xl uppercase">
                                            {preferences.full_name?.charAt(0) || preferences.email?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-lg truncate tracking-tight">{preferences.full_name}</p>
                                        <span className="bg-[#1fe2c3] text-black text-[10px] font-black px-2 py-0.5 border border-black uppercase whitespace-nowrap">
                                            PRO
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate">{preferences.email}</p>
                                </div>
                            </div>

                            <div className="border-b-2 border-black dark:border-white/20" />

                            {/* Action Links */}
                            <div className="space-y-3">
                                <Link
                                    href="/settings"
                                    onClick={() => setShowUserMenu(false)}
                                    className="flex items-center gap-3 p-3 font-bold text-sm bg-zinc-50 dark:bg-white/5 border-2 border-black dark:border-white hover:bg-[#1fe2c3] hover:text-black transition-colors"
                                >
                                    <Settings size={18} />
                                    Settings
                                </Link>

                                <button
                                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-3 p-3 font-bold text-sm bg-zinc-50 dark:bg-white/5 border-2 border-black dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors w-full"
                                >
                                    {resolvedTheme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-purple-600" />}
                                    Toggle Theme
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 font-bold text-sm bg-zinc-900 dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <LogOut size={18} />
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

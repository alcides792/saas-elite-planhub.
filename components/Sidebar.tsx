'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Bot, Bell, Calendar,
    CreditCard, BarChart3, Users, Settings,
    DollarSign, MessageSquare, HelpCircle, Shield,
    Cookie, FileText, LogOut, X, Menu,
    PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp
} from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';
import { cn } from '@/lib/utils';

// Types for Navigation
interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: 'MAIN',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { label: 'AI Assistant', href: '/dashboard/chat', icon: Bot },
            { label: 'Alerts', href: '/dashboard/alerts', icon: Bell },
            { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        ]
    },
    {
        title: 'SUBSCRIPTIONS',
        items: [
            { label: 'My Subscriptions', href: '/subscriptions', icon: CreditCard },
            { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        ]
    },
    {
        title: 'ACCOUNT',
        items: [
            { label: 'Settings', href: '/settings', icon: Settings },
            { label: 'Billing', href: '/dashboard/billing', icon: DollarSign },
        ]
    },
    {
        title: 'RESOURCES',
        items: [
            { label: 'Feedback', href: '/feedback', icon: MessageSquare },
            { label: 'Help Center', href: '/help', icon: HelpCircle },
        ]
    },
    {
        title: 'LEGAL',
        items: [
            { label: 'Privacy Policy', href: '/privacy', icon: Shield },
            { label: 'Cookie Policy', href: '/cookie', icon: Cookie },
            { label: 'Terms of Service', href: '/terms', icon: FileText },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showFooter, setShowFooter] = useState(true);
    const [userData, setUserData] = useState<{ email?: string; plan?: string }>({
        email: 'u13096246@gmail.com',
        plan: 'Free Plan'
    });

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData({
                    email: user.email,
                    plan: 'Free Plan'
                });
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full bg-white dark:bg-black backdrop-blur-xl text-zinc-900 dark:text-white border-r border-gray-200 dark:border-white/10">
            {/* Header / Logo */}
            <div className={cn(
                "p-8 pb-4 flex items-center justify-between",
                !isMobile && isCollapsed && "px-4 justify-center"
            )}>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95 transition-transform shrink-0">
                            <span className="font-black text-white text-xl">K</span>
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-neutral-400"
                            >
                                KOVR<span className="text-[#7c3aed]">.</span>
                            </motion.span>
                        )}
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {/* Desktop Collapse Toggle */}
                    {!isMobile && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={cn(
                                "p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 transition-colors",
                                isCollapsed && "absolute -right-3 top-10 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 shadow-xl z-50 rounded-full"
                            )}
                        >
                            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>
                    )}
                </div>

                {/* Mobile Close Button */}
                {isMobile && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation Area - Scrollable */}
            <div className={cn(
                "flex-1 overflow-y-auto py-2 pb-10 space-y-8 scrollbar-hide",
                (!isCollapsed || isMobile) ? "px-6" : "px-3"
            )}>
                {navSections.map((section) => (
                    <div key={section.title} className="space-y-2">
                        {(!isCollapsed || isMobile) && (
                            <h3 className="px-4 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] whitespace-nowrap">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => isMobile && setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative group text-sm font-semibold",
                                            active
                                                ? "text-black dark:text-white"
                                                : "text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white",
                                            isCollapsed && !isMobile && "justify-center px-0"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="activeHighlight"
                                                className="absolute inset-0 bg-[#7c3aed]/20 rounded-2xl border border-purple-500/20 shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <item.icon size={20} className={cn(
                                            "relative z-10 transition-all duration-300 shrink-0",
                                            active ? "text-[#7c3aed] drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]" : "group-hover:scale-110"
                                        )} />
                                        {(!isCollapsed || isMobile) && (
                                            <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Area - Fixed at bottom */}
            <div className={cn(
                "p-6 pt-4 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md space-y-4",
                isCollapsed && !isMobile && "px-3"
            )}>
                {/* Footer Toggle Header */}
                <div className={cn(
                    "flex items-center justify-between px-4 mb-2",
                    isCollapsed && !isMobile && "px-0 justify-center"
                )}>
                    {(!isCollapsed || isMobile) && (
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                            ACCOUNT
                        </span>
                    )}
                    <button
                        onClick={() => setShowFooter(!showFooter)}
                        className="text-neutral-400 hover:text-white transition-colors p-1"
                    >
                        {showFooter ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {showFooter && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 overflow-hidden"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* User Profile Info */}
                            <div className={cn(
                                "flex items-center gap-3 px-2 py-1",
                                isCollapsed && !isMobile && "flex-col gap-1"
                            )}>
                                <div className="w-11 h-11 rounded-2xl bg-[#7c3aed]/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-purple-900 flex items-center justify-center shadow-inner">
                                        <span className="font-bold text-white text-sm">U</span>
                                    </div>
                                </div>
                                {(!isCollapsed || isMobile) && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-zinc-900 dark:text-white tracking-tight leading-none mb-1">
                                            {userData.email?.split('@')[0]}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                            <p className="text-[10px] font-black text-[#7c3aed] uppercase tracking-widest leading-none">
                                                {userData.plan}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className={cn(
                                    "group relative w-full overflow-hidden flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-red-900/10 active:scale-[0.98]",
                                    isCollapsed && !isMobile && "py-3 px-2"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                                {(!isCollapsed || isMobile) && (
                                    <span className="tracking-tight uppercase text-xs">Sign Out</span>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 260 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden md:block h-screen shrink-0 border-r border-gray-200 dark:border-white/10 sticky top-0 bg-white dark:bg-black z-50 overflow-hidden"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Menu Trigger Button */}
            <div className="fixed top-0 left-0 right-0 h-16 md:hidden px-4 flex items-center justify-between z-40 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2.5 rounded-xl bg-[#7c3aed] text-white shadow-lg active:scale-90 transition-transform"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="ml-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white font-black text-sm">K</div>
                        <span className="font-black text-zinc-900 dark:text-white tracking-tighter">KOVR.</span>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay (Drawer) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
                        />
                        {/* Drawer content */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[300px] bg-white dark:bg-black z-[110] md:hidden shadow-2xl"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}


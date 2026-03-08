'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Bot, Bell, Calendar,
    CreditCard, BarChart3, Users, Settings,
    DollarSign, MessageSquare, HelpCircle,
    LogOut, X, Menu,
    PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp,
    Puzzle
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
            { label: 'Extension', href: '/dashboard/extension', icon: Puzzle },
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
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
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
        <div className="flex flex-col h-full bg-white dark:bg-black text-zinc-900 dark:text-white border-r border-gray-200 dark:border-white/10 overflow-hidden">
            {/* Header / Toggle Button */}
            {/* Header with Logo */}
            <div className={cn(
                "p-6 flex items-center justify-between",
                !isMobile && isCollapsed && "px-4 justify-center"
            )}>
                <div className="flex-1" />
                <button
                    onClick={() => isMobile ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                    className="p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Navigation Area - Scrollable */}
            <div className={cn(
                "flex-1 py-2 space-y-8 overflow-y-auto custom-scrollbar",
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
                                                className="absolute inset-0 bg-[#7c3aed]/10 rounded-2xl border border-purple-500/10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <item.icon size={20} className={cn(
                                            "relative z-10 transition-all duration-300 shrink-0",
                                            active ? "text-[#7c3aed]" : "group-hover:scale-110"
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

            {/* Spacer for bottom */}
            <div className="h-6" />
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
            <div className="fixed top-4 left-4 z-40 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-2xl active:scale-90 transition-all border border-white/10 dark:border-black/10"
                >
                    <Menu size={24} />
                </button>
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


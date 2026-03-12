'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Bot, Bell, Calendar,
    CreditCard, BarChart3, Settings,
    DollarSign, MessageSquare, HelpCircle,
    Menu, Puzzle
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

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Header with Logo Area */}
            <div className={cn(
                "p-6 flex items-center justify-between",
                !isMobile && isCollapsed && "px-4 justify-center"
            )}>
                {(!isCollapsed || isMobile) && (
                    <div className="font-bold text-xl tracking-tight px-2">Kovr</div>
                )}
                <button
                    onClick={() => isMobile ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500"
                >
                    <Menu size={18} />
                </button>
            </div>

            {/* Navigation Area - Scrollable */}
            <div className={cn(
                "flex-1 py-4 space-y-6 overflow-y-auto custom-scrollbar px-4"
            )}>
                {navSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                        {(!isCollapsed || isMobile) && (
                            <h3 className="px-3 py-2 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => isMobile && setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                            active
                                                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5",
                                            isCollapsed && !isMobile && "justify-center px-2"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <item.icon size={18} className={cn(
                                            "shrink-0",
                                            active ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                                        )} />
                                        {(!isCollapsed || isMobile) && (
                                            <span className="whitespace-nowrap">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 72 : 240 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="hidden md:block h-screen shrink-0 border-r border-gray-200 dark:border-[#222] sticky top-0 bg-white dark:bg-black z-50 overflow-hidden"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Menu Trigger Button */}
            <div className="fixed top-4 left-4 z-40 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-[#222] active:scale-95 transition-all"
                >
                    <Menu size={20} />
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
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] md:hidden"
                        />
                        {/* Drawer content */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[240px] bg-white dark:bg-black z-[110] md:hidden border-r border-gray-200 dark:border-[#222]"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

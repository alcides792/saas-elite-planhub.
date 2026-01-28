'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLayout } from '@/context/LayoutContext';
import {
    Home,
    CreditCard,
    BarChart3,
    Users,
    DollarSign,
    Settings,
    MessageSquare,
    HelpCircle,
    FileText,
    Cookie,
    Shield,
    Mail,
    LogOut,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme, toggleSidebar, isSidebarOpen } = useLayout();
    const [userEmail, setUserEmail] = useState<string>('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        async function getUserEmail() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        }
        getUserEmail();
    }, []);

    const navSections: NavSection[] = [
        {
            title: 'MAIN',
            items: [
                {
                    label: 'Dashboard',
                    href: '/dashboard',
                    icon: <Home size={18} />,
                },
            ],
        },
        {
            title: 'SUBSCRIPTIONS',
            items: [
                {
                    label: 'My Subscriptions',
                    href: '/subscriptions',
                    icon: <CreditCard size={18} />,
                },
                {
                    label: 'Analytics',
                    href: '/analytics',
                    icon: <BarChart3 size={18} />,
                },
                {
                    label: 'Family',
                    href: '/family',
                    icon: <Users size={18} />,
                },
            ],
        },
        {
            title: 'ACCOUNT',
            items: [
                {
                    label: 'Settings',
                    href: '/settings',
                    icon: <Settings size={18} />,
                },
                {
                    label: 'Billing',
                    href: '/dashboard/billing',
                    icon: <DollarSign size={18} />,
                },
            ],
        },
        {
            title: 'RESOURCES',
            items: [
                {
                    label: 'Feedback',
                    href: '/feedback',
                    icon: <MessageSquare size={18} />,
                },
                {
                    label: 'Help Center',
                    href: '/help',
                    icon: <HelpCircle size={18} />,
                },
            ],
        },
        {
            title: 'LEGAL',
            items: [
                {
                    label: 'Privacy Policy',
                    href: '/privacy',
                    icon: <Shield size={18} />,
                },
                {
                    label: 'Cookie Policy',
                    href: '/cookies',
                    icon: <Cookie size={18} />,
                },
                {
                    label: 'Terms of Service',
                    href: '/terms',
                    icon: <FileText size={18} />,
                },
            ],
        },
        {
            title: 'CONTACT',
            items: [
                {
                    label: 'Copy Email',
                    href: '#',
                    icon: <Mail size={18} />,
                },
            ],
        },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText('support@saaselite.com');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside
            className={`w-64 h-full flex flex-col relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-zinc-900 border-r border-slate-200'
                }`}
        >
            {/* --- LIGHT MODE BACKGROUND GRID --- */}
            {theme === 'light' && (
                <div className="absolute inset-0 z-0 pointer-events-none bg-[#f8fafc]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                            `,
                            backgroundSize: "20px 30px",
                            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                        }}
                    />
                </div>
            )}

            {/* --- DARK MODE BACKGROUND GRADIENT --- */}
            {theme === 'dark' && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at top, #1c1c1c, #000000)",
                    }}
                />
            )}

            <div className="relative z-10 flex flex-col h-full">
                {/* Header with Toggles */}
                <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" width={32} height={32} alt="Plan Hub Logo" className="rounded-lg shadow-sm" />
                        <h1 className="text-xl font-bold tracking-tight">Plan Hub</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            title="Close Sidebar"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-3">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href);
                                    const isEmail = item.label === 'Copy Email';

                                    return (
                                        <li key={item.label}>
                                            {isEmail ? (
                                                <button
                                                    onClick={handleCopyEmail}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:bg-white/5' : 'text-zinc-500 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                                        : theme === 'dark'
                                                            ? 'text-zinc-400 hover:bg-white/5'
                                                            : 'text-zinc-900 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* User Section with Logout */}
                <div className="p-4 border-t border-black/10 dark:border-white/10 space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                            {userEmail.charAt(0).toUpperCase() || 'E'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                                {userEmail || 'elitequality'}
                            </p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Free Plan</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-red-500/20"
                    >
                        <LogOut size={16} />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

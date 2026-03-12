'use client';

import React from 'react';
import UserMenu from '@/components/UserMenu';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
    const pathname = usePathname();

    // Map the pathname to a more friendly name for breadcrumbs
    const getPageTitle = (path: string) => {
        const segments = path.split('/').filter(Boolean);
        if (segments.length === 0) return 'Dashboard';
        
        const lastSegment = segments[segments.length - 1];
        return lastSegment.charAt(0) ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'Dashboard';
    };

    return (
        <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-gray-200 dark:border-white/10 relative z-30">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 tracking-wider uppercase">Admin</span>
                <span className="text-gray-300 dark:text-zinc-700">/</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">{getPageTitle(pathname)}</span>
            </div>

            {/* User Details & Menu */}
            <div className="flex items-center gap-4">
                {/* Search or Notifications could go here */}
                <UserMenu />
            </div>
        </header>
    );
}

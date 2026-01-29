'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useLayout } from '@/context/LayoutContext';
import { Menu, Sun, Moon } from 'lucide-react';

interface ThemeWrapperProps {
    children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
    const { theme, isSidebarOpen, toggleSidebar, toggleTheme } = useLayout();

    console.log('ThemeWrapper: Current theme is:', theme);

    return (
        <div
            id="theme-root"
            className={`min-h-screen w-full relative transition-colors duration-500 overflow-hidden ${theme} ${theme === 'dark'
                ? 'bg-black text-white'
                : 'bg-gradient-to-br from-cyan-100 via-white to-cyan-200 text-zinc-900'
                }`}
        >

            {/* --- LIGHT MODE BACKGROUND CYAN --- */}
            {theme === 'light' && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                    }}
                />
            )}

            {/* --- DARK MODE BACKGROUND GRID --- */}
            {theme === 'dark' && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: "#000000",
                        backgroundImage: `
                            linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />
            )}

            {/* --- LAYOUT STRUCTURE --- */}
            <div className="relative z-10 flex h-screen overflow-hidden">

                {/* SIDEBAR */}
                <aside
                    className={`flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 border-r border-black/10 dark:border-white/10' : 'w-0'
                        }`}
                >
                    <Sidebar />
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto relative flex flex-col">

                    {/* Toolbar (Only visible when sidebar is closed or on mobile) */}
                    <div className={`flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100 h-16'
                        }`}>
                        <div className="flex items-center gap-4">
                            {!isSidebarOpen && (
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <Menu size={20} />
                                </button>
                            )}
                            <h2 className="text-sm font-bold tracking-tight">KOVR</h2>
                        </div>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>

                    <div className="flex-1 p-4 lg:p-8">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}

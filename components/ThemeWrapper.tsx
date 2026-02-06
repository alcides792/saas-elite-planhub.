'use client';

import { ReactNode } from 'react';
import { useLayout } from '@/context/LayoutContext';

interface ThemeWrapperProps {
    children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
    const { theme } = useLayout();

    return (
        <div
            id="theme-root"
            className={`min-h-screen w-full relative transition-colors duration-500 overflow-hidden ${theme} ${theme === 'dark'
                ? 'bg-black text-white'
                : 'bg-white text-zinc-900'
                }`}
        >
            {/* --- LIGHT MODE BACKGROUND --- */}
            {theme === 'light' && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
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
                            linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />
            )}

            {/* Content Container */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
}

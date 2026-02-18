'use client';

import OnlineStatusTracker from '@/components/OnlineStatusTracker';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { UserProvider } from '@/contexts/UserContext';
import { ReactNode } from 'react';

export default function AdminClientLayout({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <LayoutProvider>
                <div className="flex h-screen w-full bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
                    {/* BACKGROUND GRID INTELIGENTE */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    >
                        <style jsx>{`
                            div {
                                --grid-color: rgba(0, 0, 0, 0.05);
                            }
                            :global(.dark) div {
                                --grid-color: rgba(255, 255, 255, 0.1);
                            }
                        `}</style>
                    </div>

                    <OnlineStatusTracker />

                    {/* 2. SIDEBAR (Acima do bg) */}
                    <div className="relative z-20 h-full">
                        <Sidebar />
                    </div>

                    {/* 3. CONTEÚDO PRINCIPAL (Acima do bg) */}
                    <main className="flex-1 relative z-10 overflow-y-auto h-full text-neutral-900 dark:text-white">
                        <div className="mx-auto max-w-7xl p-4 md:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </LayoutProvider>
        </UserProvider>
    );
}

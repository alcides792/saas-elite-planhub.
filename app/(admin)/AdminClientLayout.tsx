'use client';

import ThemeWrapper from '@/components/ThemeWrapper';
import OnlineStatusTracker from '@/components/OnlineStatusTracker';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/context/LayoutContext';
import { UserProvider } from '@/contexts/UserContext';
import { ReactNode } from 'react';

export default function AdminClientLayout({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <LayoutProvider>
                <ThemeWrapper>
                    <OnlineStatusTracker />
                    <div className="flex h-screen w-full bg-black relative overflow-hidden">
                        {/* 1. BACKGROUND GLOBAL */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                background: "#000000",
                                backgroundImage: `
                                    linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
                                `,
                                backgroundSize: "40px 40px",
                            }}
                        />

                        {/* 2. SIDEBAR (Acima do bg) */}
                        <div className="relative z-20 h-full">
                            <Sidebar />
                        </div>

                        {/* 3. CONTEÚDO PRINCIPAL (Acima do bg) */}
                        <main className="flex-1 relative z-10 overflow-y-auto h-full">
                            <div className="mx-auto max-w-7xl p-4 md:p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </ThemeWrapper>
            </LayoutProvider>
        </UserProvider>
    );
}

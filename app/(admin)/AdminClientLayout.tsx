'use client';

import OnlineStatusTracker from '@/components/OnlineStatusTracker';
import Sidebar from '@/components/Sidebar';
import OnboardingWrapper from '@/components/OnboardingWrapper';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { UserProvider } from '@/contexts/UserContext';
import { ReactNode } from 'react';

// Forced rebuild for Turbopack
export default function AdminClientLayout({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <LayoutProvider>
                <OnboardingWrapper>
                    <div className="flex h-screen w-full bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white relative overflow-hidden transition-colors duration-200">
                        <OnlineStatusTracker />

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
                </OnboardingWrapper>
            </LayoutProvider>
        </UserProvider>
    );
}

'use client';

import ThemeWrapper from '@/components/ThemeWrapper';
import OnlineStatusTracker from '@/components/OnlineStatusTracker';
import { LayoutProvider } from '@/context/LayoutContext';
import { UserProvider } from '@/contexts/UserContext';
import { ReactNode } from 'react';

export default function AdminClientLayout({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <LayoutProvider>
                <ThemeWrapper>
                    <OnlineStatusTracker />
                    {children}
                </ThemeWrapper>
            </LayoutProvider>
        </UserProvider>
    );
}

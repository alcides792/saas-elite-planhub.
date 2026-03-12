'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import OnboardingModal from './OnboardingModal';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
    const { preferences, refreshPreferences } = useUser();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isInternalLoading, setIsInternalLoading] = useState(true);

    useEffect(() => {
        // Wait for preferences to load from UserContext
        // If full_name is empty/null, it means we need onboarding
        if (preferences.email) {
            if (!preferences.full_name) {
                setShowOnboarding(true);
            } else {
                setShowOnboarding(false);
            }
            setIsInternalLoading(false);
        }
    }, [preferences.full_name, preferences.email]);

    const handleOnboardingComplete = async () => {
        await refreshPreferences();
        setShowOnboarding(false);
    };

    // If still loading baseline user info, just show children (or a loader)
    // But we don't want to flash the dashboard if it's a new user.
    // However, UserProvider already handles initial load.
    
    if (isInternalLoading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#050505]" />;
    }

    return (
        <>
            {children}
            <OnboardingModal 
                isOpen={showOnboarding} 
                onComplete={handleOnboardingComplete} 
            />
        </>
    );
}

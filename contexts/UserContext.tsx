'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '@/app/actions/settings';

interface UserPreferences {
    currency: string;
    language: string;
}

interface UserContextType {
    preferences: UserPreferences;
    refreshPreferences: () => Promise<void>;
    formatMoney: (amount: number) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>({
        currency: 'EUR',
        language: 'en-US'
    });

    const refreshPreferences = useCallback(async () => {
        const res = await getProfile();
        if (res.success && res.profile) {
            setPreferences({
                currency: res.profile.currency || 'EUR',
                language: res.profile.language || 'en-US'
            });
        }
    }, []);

    useEffect(() => {
        refreshPreferences();
    }, [refreshPreferences]);

    const formatMoney = (amount: number) => {
        try {
            return new Intl.NumberFormat(preferences.language, {
                style: 'currency',
                currency: preferences.currency,
            }).format(amount);
        } catch (e) {
            // Fallback formatting if Intl fails
            return `${preferences.currency} ${amount.toLocaleString(preferences.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    return (
        <UserContext.Provider value={{ preferences, refreshPreferences, formatMoney }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

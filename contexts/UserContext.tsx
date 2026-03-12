'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '@/app/actions/settings';
import { createClient } from '@/lib/utils/supabase/client';

interface UserPreferences {
    currency: string;
    language: string;
    full_name: string;
    avatar_url: string;
    email: string;
    plan_name: string;
    billing_status: string;
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
        language: 'en-US',
        full_name: '',
        avatar_url: '',
        email: '',
        plan_name: 'Free',
        billing_status: 'inactive'
    });

    const refreshPreferences = useCallback(async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            const res = await getProfile();
            if (res.success && res.profile) {
                setPreferences({
                    currency: res.profile.currency || 'EUR',
                    language: res.profile.language || 'en-US',
                    full_name: res.profile.full_name || '',
                    avatar_url: res.profile.avatar_url || '',
                    email: user?.email || '',
                    plan_name: res.profile.plan_name || 'Free',
                    billing_status: res.profile.billing_status || 'inactive'
                });
            } else {
                console.warn('[UserContext] Failed to load profile:', res.error);
                // Keep default preferences if profile fetch fails
            }
        } catch (error) {
            console.error('[UserContext] Error fetching profile:', error);
            // Keep default preferences on error
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

// TypeScript type definitions for the Plan Hub app

export interface Subscription {
    id: string;
    user_id: string;
    name: string;
    website: string | null;
    amount: number;
    currency: string;
    billingType: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
    category: string;
    status: 'active' | 'paused' | 'cancelled';
    renewalDate: string | null;
    paymentMethod: string | null;
    icon: string | null;
    iconColor: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface FamilyMember {
    id: string;
    family_id: string;
    user_id: string | null;
    email: string;
    name: string | null;
    role: 'owner' | 'admin' | 'member';
    status: 'active' | 'pending' | 'inactive';
    avatar: string | null;
    permissions: {
        view: boolean;
        add: boolean;
        edit: boolean;
        delete: boolean;
    };
    created_at?: string;
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

export interface User {
    id: string;
    email: string;
    user_metadata: {
        name?: string;
        display_name?: string;
        avatar_url?: string;
    };
}

export interface DashboardStats {
    monthlySpend: number;
    activeSubscriptions: number;
    nextBillingAmount: number;
    nextBillingDate: string | null;
    nextBillingService: string | null;
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface Activity {
    id: string;
    type: 'added' | 'renewed' | 'cancelled' | 'updated';
    subscription_name: string;
    amount: number;
    date: string;
    icon: string;
}

// =====================================================
// Database Mapping Utilities
// =====================================================

import type { Tables, TablesInsert } from './database.types';

/**
 * Convert database subscription (snake_case) to TypeScript Subscription (camelCase)
 */
export function dbToSubscription(dbSub: Tables<'subscriptions'>): Subscription {
    return {
        id: dbSub.id,
        user_id: dbSub.user_id,
        name: dbSub.name,
        website: dbSub.website,
        amount: dbSub.amount,
        currency: dbSub.currency,
        billingType: dbSub.billing_type as 'monthly' | 'yearly' | 'weekly' | 'quarterly',
        category: dbSub.category || 'other',
        status: dbSub.status as 'active' | 'paused' | 'cancelled',
        renewalDate: dbSub.renewal_date,
        paymentMethod: dbSub.payment_method,
        icon: dbSub.icon,
        iconColor: dbSub.icon_color,
        created_at: dbSub.created_at,
        updated_at: dbSub.updated_at,
    };
}

/**
 * Convert TypeScript Subscription (camelCase) to database insert format (snake_case)
 */
export function subscriptionToDb(sub: Partial<Subscription> & { user_id: string; name: string }): TablesInsert<'subscriptions'> {
    return {
        user_id: sub.user_id,
        name: sub.name,
        website: sub.website ?? null,
        amount: sub.amount ?? 0,
        currency: sub.currency ?? 'EUR',
        billing_type: sub.billingType ?? 'monthly',
        category: sub.category ?? 'other',
        renewal_date: sub.renewalDate ?? null,
        payment_method: sub.paymentMethod ?? null,
        icon: sub.icon ?? null,
        icon_color: sub.iconColor ?? null,
        status: sub.status ?? 'active',
        notes: null,
    };
}

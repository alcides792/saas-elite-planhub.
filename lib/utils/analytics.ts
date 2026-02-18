import { Subscription } from '@/types';

export interface MonthlyTrendData {
    month: string;
    total: number;
    subscriptionCount: number;
    isFuture: boolean;
}

export interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

// Kovr color palette for categories
export const CATEGORY_COLORS: Record<string, string> = {
    Entertainment: '#8b5cf6', // Purple
    Music: '#3b82f6',         // Blue
    Productivity: '#ec4899',  // Pink
    Software: '#f97316',      // Orange
    Gaming: '#10b981',        // Green
    Fitness: '#ef4444',       // Red
    Education: '#06b6d4',     // Cyan
    News: '#f59e0b',          // Amber
    Shopping: '#a855f7',      // Purple variant
    other: '#64748b',         // Slate
};

const COLOR_ARRAY = Object.values(CATEGORY_COLORS);

/**
 * Calculate 6-month historical spending trend up to current month
 */
export function calculateMonthlyTrend(
    subscriptions: Subscription[],
    userCreatedAt?: string
): MonthlyTrendData[] {
    const months: MonthlyTrendData[] = [];
    const now = new Date();

    // Start 5 months ago (6 points total including current month)
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let iterMonth = new Date(startDate);

    while (iterMonth <= currentMonth) {
        const monthKey = iterMonth.toLocaleDateString('pt-PT', { month: 'short' });

        let monthTotal = 0;
        let activeCount = 0;

        subscriptions.forEach(sub => {
            const subCreated = new Date(sub.created_at || new Date().toISOString());
            const subCreatedMonth = new Date(subCreated.getFullYear(), subCreated.getMonth(), 1);

            // Check if sub existed in this month
            if (subCreatedMonth <= iterMonth) {
                activeCount++;

                const amount = (() => {
                    switch (sub.billing_cycle) {
                        case 'monthly': return sub.amount;
                        case 'yearly': return sub.amount / 12;
                        default: return sub.amount;
                    }
                })();
                monthTotal += amount;
            }
        });

        months.push({
            month: monthKey,
            total: monthTotal,
            subscriptionCount: activeCount,
            isFuture: false,
        });

        iterMonth.setMonth(iterMonth.getMonth() + 1);
    }

    return months;
}

/**
 * Calculate category breakdown with Kovr colors
 */
export function calculateCategoryBreakdown(subscriptions: Subscription[]): CategoryData[] {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

    if (activeSubscriptions.length === 0) {
        return [];
    }

    const categoryTotals: Record<string, number> = {};

    activeSubscriptions.forEach(sub => {
        const category = sub.category || 'other';

        let monthlyAmount = 0;
        switch (sub.billing_cycle) {
            case 'monthly':
                monthlyAmount = sub.amount;
                break;
            case 'yearly':
                monthlyAmount = sub.amount / 12;
                break;
            default:
                monthlyAmount = sub.amount;
        }

        categoryTotals[category] = (categoryTotals[category] || 0) + monthlyAmount;
    });

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    const breakdown = Object.entries(categoryTotals)
        .map(([category, amount], index) => ({
            category,
            amount,
            percentage: (amount / total) * 100,
            color: CATEGORY_COLORS[category] || COLOR_ARRAY[index % COLOR_ARRAY.length],
        }))
        .sort((a, b) => b.amount - a.amount);

    return breakdown;
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}

export function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
}

export interface AnalyticsData {
    monthlyTotal: number;
    annualProjection: number;
    topCategory: { name: string; amount: number } | null;
    mostExpensive: Subscription | null;
    nextRenewal: { date: string; name: string; amount: number } | null;
    categoryBreakdown: { category: string; amount: number; percentage: number }[];
    nextRenewals: Subscription[];
    currency: string;
}

export function calculateAnalytics(subscriptions: Subscription[]): AnalyticsData {
    if (subscriptions.length === 0) {
        return {
            monthlyTotal: 0,
            annualProjection: 0,
            topCategory: null,
            mostExpensive: null,
            nextRenewal: null,
            categoryBreakdown: [],
            nextRenewals: [],
            currency: 'EUR',
        };
    }

    // Still find dominant currency for display purposes
    const currencyCount = subscriptions.reduce((acc, sub) => {
        acc[sub.currency] = (acc[sub.currency] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const currency = Object.keys(currencyCount).sort((a, b) => currencyCount[b] - currencyCount[a])[0];

    // FIX: Include ALL subscriptions in total regardless of currency filter
    const monthlyTotal = subscriptions.reduce((total, sub) => {
        switch (sub.billing_cycle) {
            case 'monthly': return total + sub.amount;
            case 'yearly': return total + (sub.amount / 12);
            default: return total + sub.amount;
        }
    }, 0);

    const annualProjection = monthlyTotal * 12;

    const categoryTotals = subscriptions.reduce((acc, sub) => {
        const category = sub.category || 'other';
        const monthlyAmount = (() => {
            switch (sub.billing_cycle) {
                case 'monthly': return sub.amount;
                case 'yearly': return sub.amount / 12;
                default: return sub.amount;
            }
        })();

        acc[category] = (acc[category] || 0) + monthlyAmount;
        return acc;
    }, {} as Record<string, number>);

    const topCategoryEntry = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
    const topCategory = topCategoryEntry ? { name: topCategoryEntry[0], amount: topCategoryEntry[1] } : null;

    const categoryBreakdown = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: (amount / monthlyTotal) * 100,
        }))
        .sort((a, b) => b.amount - a.amount);

    const subscriptionsWithMonthly = subscriptions
        .map(sub => ({
            ...sub,
            monthlyEquivalent: (() => {
                switch (sub.billing_cycle) {
                    case 'monthly': return sub.amount;
                    case 'yearly': return sub.amount / 12;
                    default: return sub.amount;
                }
            })(),
        }));

    const mostExpensive = subscriptionsWithMonthly.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent)[0] || null;

    const now = new Date();
    const upcomingRenewals = subscriptions
        .filter(sub => sub.next_payment && new Date(sub.next_payment) > now)
        .sort((a, b) => new Date(a.next_payment!).getTime() - new Date(b.next_payment!).getTime());

    const nextRenewal = upcomingRenewals[0]
        ? {
            date: upcomingRenewals[0].next_payment!,
            name: upcomingRenewals[0].name,
            amount: upcomingRenewals[0].amount,
        }
        : null;

    const nextRenewals = upcomingRenewals;

    return {
        monthlyTotal,
        annualProjection,
        topCategory,
        mostExpensive,
        nextRenewal,
        categoryBreakdown,
        nextRenewals,
        currency,
    };
}

/**
 * Calculate spending projection from January up to the current month
 */
export function calculateYearlyProjection(subscriptions: Subscription[]): MonthlyTrendData[] {
    const months: MonthlyTrendData[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    for (let m = 0; m <= currentMonthIndex; m++) {
        const iterMonth = new Date(currentYear, m, 1);
        const monthKey = iterMonth.toLocaleDateString('pt-PT', { month: 'short' });

        let monthTotal = 0;
        let activeCount = 0;

        subscriptions.forEach(sub => {
            if (sub.status !== 'active') return;

            const subCreated = new Date(sub.created_at || new Date().toISOString());
            const subCreatedMonth = new Date(subCreated.getFullYear(), subCreated.getMonth(), 1);

            // Check if sub existed in this month
            if (subCreatedMonth <= iterMonth) {
                activeCount++;

                const amount = (() => {
                    switch (sub.billing_cycle) {
                        case 'monthly': return sub.amount;
                        case 'yearly': return sub.amount / 12;
                        default: return sub.amount;
                    }
                })();
                monthTotal += amount;
            }
        });

        months.push({
            month: monthKey,
            total: monthTotal,
            subscriptionCount: activeCount,
            isFuture: false,
        });
    }

    return months;
}

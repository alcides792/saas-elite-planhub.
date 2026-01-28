import { Tables } from '@/types/database.types';

type Subscription = Tables<'subscriptions'>;

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

// Plan Hub color palette for categories
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
 * Calculate monthly spending trend - shows ONLY REAL historical data
 * Current month: Janeiro 2026
 */
/**
 * Calculate monthly spending trend - shows average monthly burn (Accrual basis)
 */
export function calculateMonthlyTrend(
    subscriptions: Subscription[],
    userCreatedAt?: string
): MonthlyTrendData[] {
    if (subscriptions.length === 0) {
        return [{
            month: new Date().toLocaleDateString('pt-PT', { month: 'short' }),
            total: 0,
            subscriptionCount: 0,
            isFuture: false,
        }];
    }

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Find earliest subscription
    const earliestSubDate = subscriptions.reduce((earliest, sub) => {
        const subDate = new Date(sub.created_at);
        return subDate < earliest ? subDate : earliest;
    }, new Date());

    // Timeline: last 6 months
    const startDate = new Date(currentMonth);
    startDate.setMonth(startDate.getMonth() - 5);

    const months: MonthlyTrendData[] = [];
    let iterMonth = new Date(startDate);

    while (iterMonth <= currentMonth) {
        const monthKey = iterMonth.toLocaleDateString('pt-PT', { month: 'short' });

        let monthTotal = 0;
        let activeCount = 0;

        subscriptions.forEach(sub => {
            if (sub.status !== 'active') return;

            const subCreated = new Date(sub.created_at);
            const subCreatedMonth = new Date(subCreated.getFullYear(), subCreated.getMonth(), 1);

            // Only if subscription existed in this month
            if (subCreatedMonth <= iterMonth) {
                activeCount++;

                // Use monthly equivalent for accrual-based trend
                switch (sub.billing_type) {
                    case 'monthly':
                        monthTotal += sub.amount;
                        break;
                    case 'yearly':
                        monthTotal += sub.amount / 12;
                        break;
                    case 'quarterly':
                        monthTotal += sub.amount / 3;
                        break;
                    case 'weekly':
                        monthTotal += sub.amount * 4.33;
                        break;
                    default:
                        monthTotal += sub.amount;
                }
            }
        });

        months.push({
            month: monthKey,
            total: monthTotal,
            subscriptionCount: activeCount,
            isFuture: false,
        });

        iterMonth = new Date(iterMonth.getFullYear(), iterMonth.getMonth() + 1, 1);
    }

    return months;
}

/**
 * Calculate category breakdown with Plan Hub colors
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
        switch (sub.billing_type) {
            case 'monthly':
                monthlyAmount = sub.amount;
                break;
            case 'yearly':
                monthlyAmount = sub.amount / 12;
                break;
            case 'quarterly':
                monthlyAmount = sub.amount / 3;
                break;
            case 'weekly':
                monthlyAmount = sub.amount * 4.33;
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
        // We sum everything numerically. Mixing currencies is not ideal but 
        // better than silently dropping half the data.
        switch (sub.billing_type) {
            case 'monthly': return total + sub.amount;
            case 'yearly': return total + (sub.amount / 12);
            case 'quarterly': return total + (sub.amount / 3);
            case 'weekly': return total + (sub.amount * 4.33);
            default: return total + sub.amount;
        }
    }, 0);

    const annualProjection = monthlyTotal * 12;

    const categoryTotals = subscriptions.reduce((acc, sub) => {
        const category = sub.category || 'other';
        const monthlyAmount = (() => {
            switch (sub.billing_type) {
                case 'monthly': return sub.amount;
                case 'yearly': return sub.amount / 12;
                case 'quarterly': return sub.amount / 3;
                case 'weekly': return sub.amount * 4.33;
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
                switch (sub.billing_type) {
                    case 'monthly': return sub.amount;
                    case 'yearly': return sub.amount / 12;
                    case 'quarterly': return sub.amount / 3;
                    case 'weekly': return sub.amount * 4.33;
                    default: return sub.amount;
                }
            })(),
        }));

    const mostExpensive = subscriptionsWithMonthly.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent)[0] || null;

    const now = new Date();
    const upcomingRenewals = subscriptions
        .filter(sub => sub.renewal_date && new Date(sub.renewal_date) > now)
        .sort((a, b) => new Date(a.renewal_date!).getTime() - new Date(b.renewal_date!).getTime());

    const nextRenewal = upcomingRenewals[0]
        ? {
            date: upcomingRenewals[0].renewal_date!,
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

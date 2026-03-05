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
    const joinDate = userCreatedAt ? new Date(userCreatedAt) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const joinMonth = new Date(joinDate.getFullYear(), joinDate.getMonth(), 1);

    // 6-month window (last 5 months + current)
    const windowStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // The actual start is the later of windowStart or joinMonth
    const startDate = windowStart > joinMonth ? windowStart : joinMonth;
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let iterMonth = new Date(startDate);

    while (iterMonth <= currentMonth) {
        const monthKey = iterMonth.toLocaleDateString('pt-PT', { month: 'short' });

        let monthTotal = 0;
        let activeCount = 0;

        subscriptions.forEach(sub => {
            const subCreated = new Date(sub.created_at || new Date().toISOString());
            const subCreatedMonth = new Date(subCreated.getFullYear(), subCreated.getMonth(), 1);

            // 1. Check if the subscription existed in this month/year
            if (subCreatedMonth > iterMonth) return;

            // 2. Check if the subscription had already ended BEFORE or IN this month
            if (sub.status === 'cancelled' || sub.status === 'paused') {
                // Use end_date if set (reliable). Otherwise fallback to current date.
                const endDate = new Date(sub.end_date || new Date().toISOString());
                const endDateMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                // <= means: if cancelled in March, March is also excluded (not just April+)
                if (endDateMonth <= iterMonth) return;
            }

            // 3. Billing logic (Cash Flow)
            let billsThisMonth = false;
            if (sub.billing_cycle === 'monthly') {
                billsThisMonth = true;
            } else if (sub.billing_cycle === 'yearly') {
                // For yearly, it bills only in the specific month AND it must be exactly N years after creation
                // Or if next_payment matches
                if (sub.next_payment) {
                    const nextPayment = new Date(sub.next_payment);
                    if (iterMonth.getMonth() === nextPayment.getMonth() && iterMonth.getFullYear() === nextPayment.getFullYear()) {
                        billsThisMonth = true;
                    }
                } else {
                    // Cyclic fallback: same month as creation, but what if it's the wrong year?
                    // Usually we assume it billed in subCreatedMonth, subCreatedMonth + 1 year, etc.
                    const yearsDiff = iterMonth.getFullYear() - subCreatedMonth.getFullYear();
                    if (yearsDiff >= 0 && iterMonth.getMonth() === subCreatedMonth.getMonth()) {
                        billsThisMonth = true;
                    }
                }
            } else {
                billsThisMonth = true;
            }

            if (billsThisMonth) {
                activeCount++;
                monthTotal += sub.amount;
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
export function calculateYearlyProjection(
    subscriptions: Subscription[],
    userCreatedAt?: string
): MonthlyTrendData[] {
    const months: MonthlyTrendData[] = [];
    const now = new Date();
    const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const joinDate = userCreatedAt ? new Date(userCreatedAt) : new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const joinMonth = new Date(joinDate.getFullYear(), joinDate.getMonth(), 1);

    // 6-month window: 5 past months + current month (no future)
    for (let i = -5; i <= 0; i++) {
        const iterMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);

        // Registration Clipping: Skip if month is before user joined
        if (iterMonth < joinMonth) continue;

        const monthKey = iterMonth.toLocaleDateString('pt-PT', { month: 'short' });

        let monthTotal = 0;
        let activeCount = 0;

        subscriptions.forEach(sub => {
            const subCreated = new Date(sub.created_at || new Date().toISOString());
            const subCreatedMonth = new Date(subCreated.getFullYear(), subCreated.getMonth(), 1);

            // 1. Check if subscription existed in this month/year
            if (subCreatedMonth > iterMonth) return;

            // 2. Check if subscription had already ended BEFORE or IN this month
            if (sub.status === 'cancelled' || sub.status === 'paused') {
                // Use end_date if set (reliable). Otherwise fallback to current date.
                const endDate = new Date(sub.end_date || new Date().toISOString());
                const endDateMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                // <= means: if cancelled in March, March is also excluded
                if (endDateMonth <= iterMonth) return;
            }

            // 3. Cash Flow Logic: Does it bill this month?
            let billsThisMonth = false;

            if (sub.billing_cycle === 'monthly') {
                billsThisMonth = true;
            } else if (sub.billing_cycle === 'yearly') {
                // For yearly, it bills only in the specific month AND it must be exactly N years after creation
                // Or if next_payment matches
                if (sub.next_payment) {
                    const nextPayment = new Date(sub.next_payment);
                    if (iterMonth.getMonth() === nextPayment.getMonth() && iterMonth.getFullYear() === nextPayment.getFullYear()) {
                        billsThisMonth = true;
                    }
                } else {
                    const yearsDiff = iterMonth.getFullYear() - subCreatedMonth.getFullYear();
                    if (yearsDiff >= 0 && iterMonth.getMonth() === subCreatedMonth.getMonth()) {
                        billsThisMonth = true;
                    }
                }
            } else {
                billsThisMonth = true;
            }

            if (billsThisMonth) {
                activeCount++;
                monthTotal += sub.amount;
            }
        });

        months.push({
            month: monthKey,
            total: monthTotal,
            subscriptionCount: activeCount,
            isFuture: iterMonth > currentMonthDate,
        });
    }

    return months;
}

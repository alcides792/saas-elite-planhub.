import { createClient } from '@/lib/utils/supabase/server';
import { Package } from 'lucide-react';
import {
    calculateAnalytics,
    calculateMonthlyTrend,
    calculateCategoryBreakdown
} from '@/lib/utils/analytics';
import { Subscription } from "@/types";
import { getSubscriptions } from '@/lib/actions/subscriptions';
import AnalyticsClient from '@/components/AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Get authenticated user for metadata
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="plan-hub-card p-8 text-center">
                    <p className="text-red-500 font-semibold">Authentication error. Please login again.</p>
                </div>
            </div>
        );
    }

    // Fetch subscriptions using the verified server action
    const { data: allSubscriptions, error: subsError } = await getSubscriptions();

    if (subsError) {
        console.error('DEBUG - ANALYTICS FETCH ERROR:', subsError);
        return (
            <div className="max-w-6xl mx-auto">
                <div className="plan-hub-card p-8 text-center">
                    <p className="text-red-500 font-semibold text-xl mb-2">Error loading analytics data</p>
                    <p className="text-zinc-500 text-sm">{subsError}</p>
                </div>
            </div>
        );
    }

    // Filter for active ones as originally intended
    const subscriptionList = (allSubscriptions || []).filter(s => s.status === 'active');

    // Use creation date for trend
    const userCreatedAt = user.created_at;

    // Calculate analytics
    const analytics = calculateAnalytics(subscriptionList);

    // Calculate real monthly trend data
    const monthlyTrendData = calculateMonthlyTrend(subscriptionList, userCreatedAt);

    // Calculate category breakdown
    const categoryData = calculateCategoryBreakdown(subscriptionList);

    // Get REAL next renewal
    const { data: nextRenewalData } = await supabase
        .from('subscriptions')
        .select('renewal_date, name, amount, currency, website')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .not('renewal_date', 'is', null)
        .gte('renewal_date', new Date().toISOString().split('T')[0])
        .order('renewal_date', { ascending: true })
        .limit(1);

    const nextRenewalSub = nextRenewalData && nextRenewalData.length > 0 ? nextRenewalData[0] : null;

    const realNextRenewal = nextRenewalSub ? {
        date: nextRenewalSub.renewal_date,
        name: nextRenewalSub.name,
        amount: nextRenewalSub.amount,
        currency: nextRenewalSub.currency,
        website: nextRenewalSub.website,
    } : null;

    // Empty state
    if (!subscriptionList || subscriptionList.length === 0) {
        return (
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-zinc-900 dark:text-white">Analytics</h1>
                    <p className="text-zinc-500 dark:text-zinc-300 font-medium">Detailed analysis of your spending and trends</p>
                </header>

                <div className="plan-hub-card p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-6">
                        <Package size={40} strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">No data yet</h3>
                    <p className="text-zinc-500 dark:text-zinc-300 font-medium mb-6 max-w-md mx-auto">
                        Add your first subscription to start seeing detailed analysis of your spending.
                    </p>
                    <a
                        href="/subscriptions"
                        className="inline-block px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Add Subscription
                    </a>
                </div>
            </div>
        );
    }

    return (
        <AnalyticsClient
            analytics={analytics}
            realNextRenewal={realNextRenewal}
            subscriptionsCount={subscriptionList.length}
            monthlyTrendData={monthlyTrendData}
            categoryData={categoryData}
        />
    );
}

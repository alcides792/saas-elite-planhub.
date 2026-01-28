import { createClient } from '@/lib/supabase/server';
import { Package } from 'lucide-react';
import {
    calculateAnalytics,
    calculateMonthlyTrend,
    calculateCategoryBreakdown
} from '@/lib/utils/analytics';
import AnalyticsClient from '@/components/AnalyticsClient';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Get authenticated user
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

    // Fetch active subscriptions
    const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('amount', { ascending: false });

    if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
        return (
            <div className="max-w-6xl mx-auto">
                <div className="plan-hub-card p-8 text-center">
                    <p className="text-red-500 font-semibold">Error loading data. Please try again.</p>
                </div>
            </div>
        );
    }

    // Calculate analytics
    const analytics = calculateAnalytics(subscriptions || []);

    // Get user creation date for timeline calculation
    const { data: userData } = await supabase.auth.admin.getUserById(user.id);
    const userCreatedAt = userData?.user?.created_at;

    // Calculate real monthly trend data
    const monthlyTrendData = calculateMonthlyTrend(subscriptions || [], userCreatedAt);

    // Calculate category breakdown
    const categoryData = calculateCategoryBreakdown(subscriptions || []);

    // Get REAL next renewal
    const { data: nextRenewalSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .not('renewal_date', 'is', null)
        .gte('renewal_date', new Date().toISOString().split('T')[0])
        .order('renewal_date', { ascending: true })
        .limit(1)
        .single() as { data: any };

    const realNextRenewal = nextRenewalSub ? {
        date: nextRenewalSub.renewal_date,
        name: nextRenewalSub.name,
        amount: nextRenewalSub.amount,
        currency: nextRenewalSub.currency,
        website: nextRenewalSub.website,
    } : null;

    // Empty state
    if (!subscriptions || subscriptions.length === 0) {
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
            subscriptionsCount={subscriptions.length}
            monthlyTrendData={monthlyTrendData}
            categoryData={categoryData}
        />
    );
}

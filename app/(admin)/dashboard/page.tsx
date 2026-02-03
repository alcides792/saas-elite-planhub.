import { getSubscriptions, getDashboardStats } from '@/lib/actions/subscriptions';
export const dynamic = 'force-dynamic';
import DashboardClient from '@/components/DashboardClient';
import ErrorDisplay from '@/components/ErrorDisplay';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    try {
        // Fetch subscriptions and stats from database
        const [subscriptionsResult, statsResult] = await Promise.all([
            getSubscriptions(),
            getDashboardStats(),
        ]);

        // Handle authentication errors
        if (subscriptionsResult.error === 'Unauthorized' || statsResult.error === 'Unauthorized') {
            redirect('/login');
        }

        // Handle other errors
        if (subscriptionsResult.error) {
            return <ErrorDisplay error={`Error loading subscriptions: ${subscriptionsResult.error}`} />;
        }

        if (statsResult.error) {
            return <ErrorDisplay error={`Error loading stats: ${statsResult.error}`} />;
        }

        // Pass data to client component
        return (
            <DashboardClient
                subscriptions={subscriptionsResult.data || []}
                stats={statsResult.data || { monthlySpend: 0, yearlySpend: 0, activeCount: 0, totalCount: 0 }}
            />
        );
    } catch (error) {
        console.error('Dashboard error:', error);
        return (
            <ErrorDisplay
                error={`Error loading dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`}
            />
        );
    }
}

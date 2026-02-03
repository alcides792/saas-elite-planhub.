import { getSubscriptions } from '@/lib/actions/subscriptions';
export const dynamic = 'force-dynamic';
import SubscriptionsClient from '@/components/SubscriptionsClient';
import ErrorDisplay from '@/components/ErrorDisplay';
import { redirect } from 'next/navigation';

export default async function SubscriptionsPage() {
    try {
        // Fetch subscriptions from database
        const { data: subscriptions, error } = await getSubscriptions();

        // Handle authentication errors
        if (error === 'Unauthorized') {
            redirect('/login');
        }

        // Handle other errors
        if (error) {
            return <ErrorDisplay error={`Error loading subscriptions: ${error}`} />;
        }

        // Pass data to client component
        return <SubscriptionsClient initialSubscriptions={subscriptions || []} />;
    } catch (error) {
        console.error('Subscriptions page error:', error);
        return (
            <ErrorDisplay
                error={`Error loading subscriptions page: ${error instanceof Error ? error.message : 'Unknown error'}`}
            />
        );
    }
}

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { dbToSubscription, subscriptionToDb, type Subscription } from '@/types';
import type { TablesInsert, TablesUpdate } from '@/types/database.types';
import { requireProPlan } from '@/utils/gatekeeper';

/**
 * Get all subscriptions for the authenticated user
 */
export async function getSubscriptions(): Promise<{ data: Subscription[] | null; error: string | null }> {
    try {
        console.log('[getSubscriptions] Starting...');
        const supabase = await createClient();
        console.log('[getSubscriptions] Supabase client created');

        // Get authenticated user
        console.log('[getSubscriptions] Getting session...');
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log('[getSubscriptions] Session result:', { hasSession: !!session, authError });

        if (authError || !session?.user) {
            console.log('[getSubscriptions] No session or auth error');
            return { data: null, error: 'Unauthorized' };
        }

        // Query subscriptions
        console.log('[getSubscriptions] Querying subscriptions for user:', session.user.id);
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getSubscriptions] Error fetching subscriptions:', error);
            return { data: null, error: error.message };
        }

        console.log('[getSubscriptions] Found subscriptions:', data?.length || 0);

        // Map database records to TypeScript types
        const subscriptions = data.map(dbToSubscription);

        return { data: subscriptions, error: null };
    } catch (error) {
        console.error('[getSubscriptions] Unexpected error:', error);
        return { data: null, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
}

/**
 * Create a new subscription
 */
export async function createSubscription(
    subscriptionData: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ data: Subscription | null; error: string | null }> {
    try {
        // 🔒 TRAVA DE SEGURANÇA
        const isPro = await requireProPlan();
        if (!isPro) {
            return { data: null, error: "Bloqueado: Você precisa de um plano Pro para adicionar assinaturas." };
        }

        const supabase = await createClient();

        // Get authenticated user
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
            return { data: null, error: 'Unauthorized' };
        }

        // Prepare insert payload
        const insertPayload: TablesInsert<'subscriptions'> = {
            user_id: session.user.id,
            name: subscriptionData.name,
            website: subscriptionData.website ?? null,
            amount: subscriptionData.amount ?? 0,
            currency: subscriptionData.currency ?? 'EUR',
            billing_type: subscriptionData.billingType ?? 'monthly',
            category: subscriptionData.category ?? 'other',
            renewal_date: subscriptionData.renewalDate ?? null,
            payment_method: subscriptionData.paymentMethod ?? null,
            icon: subscriptionData.icon ?? null,
            icon_color: subscriptionData.iconColor ?? null,
            status: subscriptionData.status ?? 'active',
        };

        // Insert into database
        const { data, error } = await supabase
            .from('subscriptions')
            .insert(insertPayload as TablesInsert<'subscriptions'>)
            .select()
            .single();

        if (error) {
            console.error('Error creating subscription:', error);
            return { data: null, error: error.message };
        }

        // Revalidate the subscriptions page
        revalidatePath('/subscriptions');

        return { data: dbToSubscription(data), error: null };
    } catch (error) {
        console.error('Unexpected error in createSubscription:', error);
        return { data: null, error: 'An unexpected error occurred' };
    }
}

/**
 * Update an existing subscription
 */
export async function updateSubscription(
    id: string,
    updates: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ data: Subscription | null; error: string | null }> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
            return { data: null, error: 'Unauthorized' };
        }

        // Prepare update payload (convert camelCase to snake_case)
        const updatePayload: TablesUpdate<'subscriptions'> = {};

        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.website !== undefined) updatePayload.website = updates.website;
        if (updates.amount !== undefined) updatePayload.amount = updates.amount;
        if (updates.currency !== undefined) updatePayload.currency = updates.currency;
        if (updates.billingType !== undefined) updatePayload.billing_type = updates.billingType;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.renewalDate !== undefined) updatePayload.renewal_date = updates.renewalDate;
        if (updates.paymentMethod !== undefined) updatePayload.payment_method = updates.paymentMethod;
        if (updates.icon !== undefined) updatePayload.icon = updates.icon;
        if (updates.iconColor !== undefined) updatePayload.icon_color = updates.iconColor;
        if (updates.status !== undefined) updatePayload.status = updates.status;

        // Update in database (RLS ensures user owns this subscription)
        const { data, error } = await supabase
            .from('subscriptions')
            .update(updatePayload)
            .eq('id', id)
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating subscription:', error);
            return { data: null, error: error.message };
        }

        // Revalidate the subscriptions page
        revalidatePath('/subscriptions');

        return { data: dbToSubscription(data), error: null };
    } catch (error) {
        console.error('Unexpected error in updateSubscription:', error);
        return { data: null, error: 'An unexpected error occurred' };
    }
}

/**
 * Delete a subscription
 */
export async function deleteSubscription(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete from database (RLS ensures user owns this subscription)
        console.log(`[deleteSubscription] Attempting to delete sub ${id} for user ${session.user.id}`);
        const { error, count } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            console.error('[deleteSubscription] Error deleting subscription:', error);
            return { success: false, error: error.message };
        }

        console.log(`[deleteSubscription] Successfully deleted. Rows affected: ${count}`);

        // Revalidate the subscriptions page
        revalidatePath('/subscriptions');

        return { success: true, error: null };
    } catch (error) {
        console.error('Unexpected error in deleteSubscription:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Toggle subscription status between active and paused
 */
export async function toggleSubscriptionStatus(id: string): Promise<{ data: Subscription | null; error: string | null }> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
            return { data: null, error: 'Unauthorized' };
        }

        // First, get the current subscription
        const { data: currentSub, error: fetchError } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('id', id)
            .eq('user_id', session.user.id)
            .single() as { data: { status: 'active' | 'paused' | 'cancelled' } | null; error: any };

        if (fetchError || !currentSub) {
            console.error('Error fetching subscription:', fetchError);
            return { data: null, error: fetchError?.message || 'Subscription not found' };
        }

        // Toggle status
        const newStatus = currentSub.status === 'active' ? 'paused' : 'active';

        // Update in database
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ status: newStatus } as TablesUpdate<'subscriptions'>)
            .eq('id', id)
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (error) {
            console.error('Error toggling subscription status:', error);
            return { data: null, error: error.message };
        }

        // Revalidate the subscriptions page
        revalidatePath('/subscriptions');

        return { data: dbToSubscription(data), error: null };
    } catch (error) {
        console.error('Unexpected error in toggleSubscriptionStatus:', error);
        return { data: null, error: 'An unexpected error occurred' };
    }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
    data: {
        monthlySpend: number;
        yearlySpend: number;
        activeCount: number;
        totalCount: number;
    } | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session?.user) {
            return { data: null, error: 'Unauthorized' };
        }

        // Get all subscriptions
        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('amount, billing_type, status')
            .eq('user_id', session.user.id) as {
                data: Array<{
                    amount: number;
                    billing_type: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
                    status: 'active' | 'paused' | 'cancelled'
                }> | null;
                error: any
            };

        if (error || !subscriptions) {
            console.error('Error fetching subscriptions for stats:', error);
            return { data: null, error: error?.message || 'Failed to fetch subscriptions' };
        }

        // Calculate statistics - Normalize everything to Monthly Run Rate (MRR)
        const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

        const monthlySpend = activeSubscriptions.reduce((total, sub) => {
            let normalizedMonthly = 0;
            switch (sub.billing_type) {
                case 'monthly':
                    normalizedMonthly = sub.amount;
                    break;
                case 'yearly':
                    normalizedMonthly = sub.amount / 12;
                    break;
                case 'quarterly':
                    normalizedMonthly = sub.amount / 3;
                    break;
                case 'weekly':
                    normalizedMonthly = (sub.amount * 52) / 12;
                    break;
                default:
                    normalizedMonthly = sub.amount;
            }
            return total + normalizedMonthly;
        }, 0);

        // Ensure precision and calculate projected annual run rate
        const preciseMonthlySpend = parseFloat(monthlySpend.toFixed(2));
        const preciseYearlySpend = parseFloat((preciseMonthlySpend * 12).toFixed(2));

        return {
            data: {
                monthlySpend: preciseMonthlySpend,
                yearlySpend: preciseYearlySpend,
                activeCount: activeSubscriptions.length,
                totalCount: subscriptions.length,
            },
            error: null,
        };
    } catch (error) {
        console.error('Unexpected error in getDashboardStats:', error);
        return { data: null, error: 'An unexpected error occurred' };
    }
}

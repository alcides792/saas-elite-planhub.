'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get the user's family and all members
 */
export async function getMyFamily(): Promise<{
    success: boolean;
    family?: {
        id: string;
        name: string;
        owner_id: string;
        created_at: string;
        members: Array<{
            user_id: string;
            role: string;
            joined_at: string;
            email: string;
            full_name: string | null;
        }>;
    };
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's family membership
        const { data: membership } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('user_id', user.id)
            .single() as { data: any };

        if (!membership) {
            return { success: true }; // No family yet
        }

        // Get family details
        const { data: family, error: familyError } = await supabase
            .from('families')
            .select('*')
            .eq('id', membership.family_id)
            .single() as { data: any; error: any };

        if (familyError) {
            return { success: false, error: 'Error leaving family' };
        }

        // Get all family members with their profile info
        const { data: members, error: membersError } = await supabase
            .from('family_members')
            .select(`
        user_id,
        role,
        joined_at
      `)
            .eq('family_id', family.id) as { data: any[]; error: any };

        if (membersError) {
            return { success: false, error: 'Error fetching members' };
        }

        // Get profile info for each member
        const membersWithProfiles = await Promise.all(
            members.map(async (member) => {
                const { data: userData } = await supabase.auth.admin.getUserById(member.user_id);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', member.user_id)
                    .single() as { data: any };

                return {
                    ...member,
                    email: userData?.user?.email || 'Unknown',
                    full_name: profile?.full_name || null,
                };
            })
        );

        return {
            success: true,
            family: {
                ...family,
                members: membersWithProfiles,
            },
        };
    } catch (error) {
        console.error('Error in getMyFamily:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Create a new family
 */
export async function createFamily(name: string): Promise<{
    success: boolean;
    familyId?: string;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Check if user already has a family
        const { data: existing } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return { success: false, error: 'You already belong to a family' };
        }

        // Create family
        const { data: family, error: familyError } = await (supabase as any)
            .from('families')
            .insert({
                owner_id: user.id,
                name,
            })
            .select()
            .single();

        if (familyError) {
            console.error('Error creating family:', familyError);
            return { success: false, error: 'Error creating family' };
        }

        // Add owner as member
        const { error: memberError } = await (supabase as any)
            .from('family_members')
            .insert({
                family_id: family.id,
                user_id: user.id,
                role: 'owner',
            });

        if (memberError) {
            console.error('Error adding owner as member:', memberError);
            return { success: false, error: 'Unexpected error' };
        }

        revalidatePath('/family');
        return { success: true, familyId: family.id };
    } catch (error) {
        console.error('Error in createFamily:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Invite someone by email
 */
export async function inviteByEmail(email: string): Promise<{
    success: boolean;
    inviteLink?: string;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's family
        const { data: membership } = await supabase
            .from('family_members')
            .select('family_id, role')
            .eq('user_id', user.id)
            .single() as { data: any };

        if (!membership) {
            return { success: false, error: 'You don\'t belong to a family' };
        }

        if (membership.role !== 'owner') {
            return { success: false, error: 'Only the owner can invite members' };
        }

        // Generate token
        const { data: tokenData } = await supabase.rpc('generate_invite_token');
        const token = tokenData as unknown as string;

        // Create invite
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const { error: inviteError } = await (supabase as any)
            .from('family_invites')
            .insert({
                family_id: membership.family_id,
                email,
                token,
                expires_at: expiresAt.toISOString(),
            });

        if (inviteError) {
            console.error('Error creating invite:', inviteError);
            return { success: false, error: 'Error creating invite' };
        }

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;

        revalidatePath('/family');
        return { success: true, inviteLink };
    } catch (error) {
        console.error('Error in inviteByEmail:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Get pending invites for the family
 */
export async function getPendingInvites(): Promise<{
    success: boolean;
    invites?: Array<{
        id: string;
        email: string;
        token: string;
        created_at: string;
        expires_at: string;
    }>;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's family
        const { data: membership } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('user_id', user.id)
            .single() as { data: any };

        if (!membership) {
            return { success: true, invites: [] };
        }

        // Get pending invites
        const { data: invites, error: invitesError } = await supabase
            .from('family_invites')
            .select('*')
            .eq('family_id', membership.family_id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false }) as { data: any[]; error: any };

        if (invitesError) {
            return { success: false, error: 'Error fetching invites' };
        }

        return { success: true, invites };
    } catch (error) {
        console.error('Error in getPendingInvites:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Accept an invite
 */
export async function acceptInvite(token: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get invite
        const { data: invite, error: inviteError } = await supabase
            .from('family_invites')
            .select('*')
            .eq('token', token)
            .eq('status', 'pending')
            .single() as { data: any; error: any };

        if (inviteError || !invite) {
            return { success: false, error: 'Invalid or expired invite' };
        }

        // Check if expired
        if (new Date(invite.expires_at) < new Date()) {
            return { success: false, error: 'Invite expired' };
        }

        // Check if user already in a family
        const { data: existing } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return { success: false, error: 'You already belong to a family' };
        }

        // Check family member limit (Max 5)
        const { count, error: countError } = await supabase
            .from('family_members')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', invite.family_id);

        if (countError) {
            console.error('Error checking family limit:', countError);
            return { success: false, error: 'Error checking family limit' };
        }

        if (count !== null && count >= 5) {
            return { success: false, error: 'This family has reached the limit of 5 members.' };
        }

        // Add user to family
        const { error: memberError } = await (supabase as any)
            .from('family_members')
            .insert({
                family_id: invite.family_id,
                user_id: user.id,
                role: 'member',
            });

        if (memberError) {
            console.error('Error adding member:', memberError);
            return { success: false, error: 'Error accepting invite' };
        }

        // Upgrade user to PRO plan (Sponsored)
        // @ts-ignore - 'plan' column might be added soon but is not in current types
        await (supabase as any)
            .from('profiles')
            .update({ plan: 'pro' })
            .eq('id', user.id);

        // Update invite status
        await (supabase as any)
            .from('family_invites')
            .update({
                status: 'accepted',
                accepted_at: new Date().toISOString(),
            })
            .eq('id', invite.id);

        revalidatePath('/family');
        return { success: true };
    } catch (error) {
        console.error('Error in acceptInvite:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Remove a member from the family
 */
export async function removeMember(memberId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's family and role
        const { data: membership } = await supabase
            .from('family_members')
            .select('family_id, role')
            .eq('user_id', user.id)
            .single() as { data: any };

        if (!membership || membership.role !== 'owner') {
            return { success: false, error: 'Only the owner can remove members' };
        }

        // Can't remove yourself
        if (memberId === user.id) {
            return { success: false, error: 'You cannot remove yourself. Use "Leave Family"' };
        }

        // Remove member
        const { error: removeError } = await supabase
            .from('family_members')
            .delete()
            .eq('family_id', membership.family_id)
            .eq('user_id', memberId);

        if (removeError) {
            console.error('Error removing member:', removeError);
            return { success: false, error: 'Error removing member' };
        }

        // Downgrade member to FREE plan
        // @ts-ignore
        await (supabase as any)
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', memberId);

        revalidatePath('/family');
        return { success: true };
    } catch (error) {
        console.error('Error in removeMember:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Leave the family
 */
export async function leaveFamily(): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user's family and role
        const { data: membership } = await supabase
            .from('family_members')
            .select('family_id, role')
            .eq('user_id', user.id)
            .single() as { data: any };

        if (!membership) {
            return { success: false, error: 'You don\'t belong to a family' };
        }

        if (membership.role === 'owner') {
            return { success: false, error: 'The owner cannot leave. Delete the family or transfer ownership first' };
        }

        // Leave family
        const { error: leaveError } = await supabase
            .from('family_members')
            .delete()
            .eq('family_id', membership.family_id)
            .eq('user_id', user.id);

        if (leaveError) {
            console.error('Error leaving family:', leaveError);
            return { success: false, error: 'Error leaving family' };
        }

        // Downgrade myself to FREE plan
        // @ts-ignore
        await (supabase as any)
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', user.id);

        revalidatePath('/family');
        return { success: true };
    } catch (error) {
        console.error('Error in leaveFamily:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

/**
 * Get subscriptions for a specific family member (Audit)
 */
export async function getMemberSubscriptions(memberId: string): Promise<{
    success: boolean;
    subscriptions?: any[];
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Not authenticated' };
        }

        // We rely on RLS to allow the Admin to see these
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', memberId)
            .order('amount', { ascending: false });

        if (error) {
            console.error('Error in getMemberSubscriptions:', error);
            // If RLS blocks it, it's probably because requester is not the family admin
            return { success: false, error: 'Access denied or error fetching subscriptions' };
        }

        return { success: true, subscriptions: data || [] };
    } catch (error) {
        console.error('Error in getMemberSubscriptions:', error);
        return { success: false, error: 'Unexpected error' };
    }
}

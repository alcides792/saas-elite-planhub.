'use server';

import { createClient } from '@/lib/utils/supabase/server';

export async function createFeedbackPost(data: {
    title: string;
    content: string;
    category: 'idea' | 'issue' | 'in-progress' | 'completed';
}) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { data: null, error: 'Unauthorized' };
        }

        const { data: post, error } = await (supabase as any)
            .from('feedback_posts')
            .insert({
                user_id: user.id,
                title: data.title,
                content: data.content,
                category: data.category,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return { data: null, error: error.message };
        }

        return { data: post, error: null };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { data: null, error: 'Failed to create post' };
    }
}

export async function getFeedbackPosts(category?: string) {
    try {
        const supabase = await createClient();

        // First, try to get posts with profiles (LEFT JOIN)
        let query = supabase
            .from('feedback_posts')
            .select(`
        *,
        profiles!left (
          full_name
        )
      `)
            .order('votes', { ascending: false })
            .order('created_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching posts with profiles:', error);

            // Fallback: try without profiles join
            let fallbackQuery = supabase
                .from('feedback_posts')
                .select('*')
                .order('votes', { ascending: false })
                .order('created_at', { ascending: false });

            if (category && category !== 'all') {
                fallbackQuery = fallbackQuery.eq('category', category);
            }

            const { data: fallbackData, error: fallbackError } = await fallbackQuery;

            if (fallbackError) {
                console.error('Fallback query also failed:', fallbackError);
                return { data: null, error: fallbackError.message };
            }

            return { data: fallbackData, error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error fetching posts:', error);
        return { data: null, error: 'Failed to fetch posts' };
    }
}

export async function toggleVote(postId: string) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { data: null, error: 'Unauthorized' };
        }

        // Check if already voted
        const { data: existingVote } = await supabase
            .from('feedback_votes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        if (existingVote) {
            // Remove vote
            const { error } = await (supabase as any)
                .from('feedback_votes')
                .delete()
                .eq('id', (existingVote as any).id);

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: { voted: false }, error: null };
        } else {
            // Add vote
            const { error } = await (supabase as any)
                .from('feedback_votes')
                .insert({
                    post_id: postId,
                    user_id: user.id,
                });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: { voted: true }, error: null };
        }
    } catch (error) {
        return { data: null, error: 'Failed to toggle vote' };
    }
}

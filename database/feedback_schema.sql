-- Feedback/Community Posts System
-- This allows users to share experiences and ideas

-- Create feedback_posts table
CREATE TABLE IF NOT EXISTS public.feedback_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('idea', 'issue', 'in-progress', 'completed')),
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback_votes table (to track who voted)
CREATE TABLE IF NOT EXISTS public.feedback_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create feedback_comments table
CREATE TABLE IF NOT EXISTS public.feedback_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback_posts
CREATE POLICY "Anyone can view feedback posts"
    ON public.feedback_posts FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create feedback posts"
    ON public.feedback_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback posts"
    ON public.feedback_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback posts"
    ON public.feedback_posts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for feedback_votes
CREATE POLICY "Anyone can view votes"
    ON public.feedback_votes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can vote"
    ON public.feedback_votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
    ON public.feedback_votes FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for feedback_comments
CREATE POLICY "Anyone can view comments"
    ON public.feedback_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.feedback_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON public.feedback_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON public.feedback_comments FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_posts_user_id ON public.feedback_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_posts_category ON public.feedback_posts(category);
CREATE INDEX IF NOT EXISTS idx_feedback_posts_created_at ON public.feedback_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_votes_post_id ON public.feedback_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_post_id ON public.feedback_comments(post_id);

-- Function to update vote count
CREATE OR REPLACE FUNCTION update_feedback_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.feedback_posts
        SET votes = votes + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.feedback_posts
        SET votes = votes - 1
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update vote count
DROP TRIGGER IF EXISTS feedback_vote_count_trigger ON public.feedback_votes;
CREATE TRIGGER feedback_vote_count_trigger
    AFTER INSERT OR DELETE ON public.feedback_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_vote_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_feedback_posts_updated_at ON public.feedback_posts;
CREATE TRIGGER update_feedback_posts_updated_at
    BEFORE UPDATE ON public.feedback_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_comments_updated_at ON public.feedback_comments;
CREATE TRIGGER update_feedback_comments_updated_at
    BEFORE UPDATE ON public.feedback_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

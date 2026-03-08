-- Fix foreign key relationship for feedback_posts
-- Redirect user_id to reference public.profiles(id) instead of auth.users(id)
-- This allows Supabase (PostgREST) to automatically resolve the join

ALTER TABLE public.feedback_posts 
DROP CONSTRAINT IF EXISTS feedback_posts_user_id_fkey,
ADD CONSTRAINT feedback_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also fix and ensure feedback_votes and feedback_comments reference profiles for easier joins if needed
ALTER TABLE public.feedback_votes 
DROP CONSTRAINT IF EXISTS feedback_votes_user_id_fkey,
ADD CONSTRAINT feedback_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.feedback_comments 
DROP CONSTRAINT IF EXISTS feedback_comments_user_id_fkey,
ADD CONSTRAINT feedback_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

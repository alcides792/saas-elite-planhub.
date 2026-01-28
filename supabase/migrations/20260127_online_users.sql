-- Create online_users table to track user activity
CREATE TABLE IF NOT EXISTS public.online_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.online_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own status"
ON public.online_users FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own status"
ON public.online_users FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view all online status"
ON public.online_users FOR SELECT
USING (true); -- Or restrict to authenticated users if needed

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.online_users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

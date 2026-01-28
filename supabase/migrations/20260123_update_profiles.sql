-- Update profiles table for the ELITE COMMAND PANEL expansion
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS language text DEFAULT 'pt-BR',
ADD COLUMN IF NOT EXISTS notify_emails boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_summary boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_days_before integer DEFAULT 3;

-- Ensure extension_api_key is unique
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_extension_api_key_key'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_extension_api_key_key UNIQUE (extension_api_key);
    END IF;
END $$;

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

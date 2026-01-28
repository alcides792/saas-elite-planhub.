-- =====================================================
-- API Key Authentication Migration
-- Execute this SQL in Supabase SQL Editor
-- =====================================================

-- 1. Add extension_api_key column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS extension_api_key TEXT UNIQUE;

-- 2. Create index for fast API key lookups
CREATE INDEX IF NOT EXISTS idx_profiles_extension_api_key 
ON public.profiles(extension_api_key) 
WHERE extension_api_key IS NOT NULL;

-- 3. Function to generate unique API keys with 'elite_' prefix
CREATE OR REPLACE FUNCTION public.generate_extension_api_key()
RETURNS TEXT AS $$
DECLARE
    new_key TEXT;
    key_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random key: elite_ + 32 random characters
        new_key := 'elite_' || encode(gen_random_bytes(24), 'base64');
        -- Remove special characters that might cause issues
        new_key := replace(replace(replace(new_key, '/', ''), '+', ''), '=', '');
        -- Ensure it's exactly 38 characters (elite_ + 32 chars)
        new_key := substring(new_key, 1, 38);
        
        -- Check if key already exists
        SELECT EXISTS(
            SELECT 1 FROM public.profiles WHERE extension_api_key = new_key
        ) INTO key_exists;
        
        -- Exit loop if key is unique
        EXIT WHEN NOT key_exists;
    END LOOP;
    
    RETURN new_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Function to get user_id from API key (used by the API)
CREATE OR REPLACE FUNCTION public.get_user_by_api_key(api_key TEXT)
RETURNS UUID AS $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid
    FROM public.profiles
    WHERE extension_api_key = api_key;
    
    RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Done! ✅
-- You can now generate API keys for users
-- =====================================================

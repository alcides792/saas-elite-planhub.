-- =====================================================
-- Family Groups System - Complete Schema
-- Execute this SQL in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. FAMILIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Policies: Users can see families they own or are members of
CREATE POLICY "View own or member families" ON public.families
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_id = id AND user_id = auth.uid()
    )
  );

-- Only owners can create families
CREATE POLICY "Create own family" ON public.families
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only owners can update their families
CREATE POLICY "Update own family" ON public.families
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only owners can delete their families
CREATE POLICY "Delete own family" ON public.families
  FOR DELETE USING (auth.uid() = owner_id);

-- =====================================================
-- 2. FAMILY MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.family_members (
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (family_id, user_id)
);

-- Enable RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Policies: Members can see other members in their family
CREATE POLICY "View family members" ON public.family_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_id AND fm.user_id = auth.uid()
    )
  );

-- Only family owners can add members (via invite acceptance)
CREATE POLICY "Add family members" ON public.family_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    ) OR
    user_id = auth.uid() -- Allow users to add themselves when accepting invite
  );

-- Only owners can remove members
CREATE POLICY "Remove family members" ON public.family_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    ) OR
    user_id = auth.uid() -- Allow users to remove themselves (leave family)
  );

-- =====================================================
-- 3. FAMILY INVITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.family_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.family_invites ENABLE ROW LEVEL SECURITY;

-- Policies: Family owners can see their invites
CREATE POLICY "View family invites" ON public.family_invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    ) OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) -- Invitees can see their own invites
  );

-- Only family owners can create invites
CREATE POLICY "Create family invites" ON public.family_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    )
  );

-- Owners and invitees can update invites (for acceptance)
CREATE POLICY "Update family invites" ON public.family_invites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    ) OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Only owners can delete invites
CREATE POLICY "Delete family invites" ON public.family_invites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE id = family_id AND owner_id = auth.uid()
    )
  );

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_families_owner ON public.families(owner_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_invites_family ON public.family_invites(family_id);
CREATE INDEX IF NOT EXISTS idx_family_invites_token ON public.family_invites(token);
CREATE INDEX IF NOT EXISTS idx_family_invites_email ON public.family_invites(email);

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to generate secure invite token
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS TEXT AS $$
DECLARE
    new_token TEXT;
    token_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random token: fam_ + 32 random characters
        new_token := 'fam_' || encode(gen_random_bytes(24), 'base64');
        -- Remove special characters
        new_token := replace(replace(replace(new_token, '/', ''), '+', ''), '=', '');
        -- Ensure it's exactly 36 characters
        new_token := substring(new_token, 1, 36);
        
        -- Check if token already exists
        SELECT EXISTS(
            SELECT 1 FROM public.family_invites WHERE token = new_token
        ) INTO token_exists;
        
        -- Exit loop if token is unique
        EXIT WHEN NOT token_exists;
    END LOOP;
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is family owner
CREATE OR REPLACE FUNCTION public.is_family_owner(p_family_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.families
        WHERE id = p_family_id AND owner_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's family
CREATE OR REPLACE FUNCTION public.get_user_family(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    family_uuid UUID;
BEGIN
    SELECT family_id INTO family_uuid
    FROM public.family_members
    WHERE user_id = p_user_id
    LIMIT 1;
    
    RETURN family_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Done! ✅
-- =====================================================

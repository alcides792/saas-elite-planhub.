-- Create families table
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- Create family_invites table
CREATE TABLE IF NOT EXISTS family_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invites ENABLE ROW LEVEL SECURITY;

-- Families Policies
CREATE POLICY "Users can view their own families" 
ON families FOR SELECT 
USING (auth.uid() = owner_id OR EXISTS (
  SELECT 1 FROM family_members WHERE family_id = families.id AND user_id = auth.uid()
));

CREATE POLICY "Owners can manage their families" 
ON families FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create families" 
ON families FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Family Members Policies
CREATE POLICY "Members can view family roster" 
ON family_members FOR SELECT 
USING (family_id IN (
  SELECT family_id FROM family_members WHERE user_id = auth.uid()
));

CREATE POLICY "Owners can remove members" 
ON family_members FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM families WHERE id = family_members.family_id AND owner_id = auth.uid()
));

-- Family Invites Policies
CREATE POLICY "Invitees can view their invites" 
ON family_invites FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Owners can manage invites" 
ON family_invites FOR ALL 
USING (EXISTS (
  SELECT 1 FROM families WHERE id = family_invites.family_id AND owner_id = auth.uid()
));

-- RPC: generate_invite_token
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

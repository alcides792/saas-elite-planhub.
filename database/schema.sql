-- =====================================================
-- SaaS Manager Elite - Database Schema
-- Execute this SQL in Supabase SQL Editor
-- =====================================================

-- Enable RLS (Row Level Security)
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- 1. Profiles Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. Subscriptions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  billing_type TEXT DEFAULT 'monthly' CHECK (billing_type IN ('monthly', 'yearly', 'weekly', 'quarterly')),
  category TEXT,
  renewal_date DATE,
  payment_method TEXT,
  icon TEXT,
  icon_color TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. Family Members Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  member_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  member_email TEXT NOT NULL,
  member_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined')),
  permissions JSONB DEFAULT '{"view": true, "add": false, "edit": false, "delete": false}'::jsonb,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Owners can view their family members" ON public.family_members
  FOR SELECT USING (auth.uid() = family_owner_id);

CREATE POLICY "Owners can create family members" ON public.family_members
  FOR INSERT WITH CHECK (auth.uid() = family_owner_id);

CREATE POLICY "Owners can update family members" ON public.family_members
  FOR UPDATE USING (auth.uid() = family_owner_id);

CREATE POLICY "Owners can delete family members" ON public.family_members
  FOR DELETE USING (auth.uid() = family_owner_id);

-- Members can see families they belong to
CREATE POLICY "Members can view their family" ON public.family_members
  FOR SELECT USING (member_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- =====================================================
-- 4. Shared Subscriptions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shared_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES public.family_members ON DELETE CASCADE NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_id, shared_with)
);

-- Enable RLS
ALTER TABLE public.shared_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view shared subscriptions" ON public.shared_subscriptions
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM public.subscriptions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can share their subscriptions" ON public.shared_subscriptions
  FOR INSERT WITH CHECK (
    subscription_id IN (SELECT id FROM public.subscriptions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can unshare subscriptions" ON public.shared_subscriptions
  FOR DELETE USING (
    subscription_id IN (SELECT id FROM public.subscriptions WHERE user_id = auth.uid())
  );

-- =====================================================
-- 5. Payment Methods Table (Optional)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  card_brand TEXT NOT NULL,
  card_last_four TEXT NOT NULL,
  card_holder_name TEXT,
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON public.subscriptions(category);
CREATE INDEX IF NOT EXISTS idx_family_members_owner ON public.family_members(family_owner_id);
CREATE INDEX IF NOT EXISTS idx_family_members_email ON public.family_members(member_email);

-- =====================================================
-- 6. Intelligence & Activity Tracking
-- =====================================================

-- Usage Logs for tracking activity per subscription
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'stream', 'download', 'login', etc.
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own usage logs" ON public.usage_logs
  FOR ALL USING (auth.uid() = user_id);

-- Intelligence Insights for AI recommendations
CREATE TABLE IF NOT EXISTS public.intelligence_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL, -- 'overlap', 'underused', 'saving'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_link TEXT,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.intelligence_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own insights" ON public.intelligence_insights
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 7. Functions & RPC
-- =====================================================

-- Function to detect subscription overlaps (same category)
CREATE OR REPLACE FUNCTION public.get_subscription_overlaps(p_user_id UUID)
RETURNS TABLE (category TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT s.category, COUNT(*) as cat_count
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id AND s.status = 'active'
  GROUP BY s.category
  HAVING COUNT(*) > 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate initial insights (Simulating AI)
CREATE OR REPLACE FUNCTION public.generate_user_insights(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    overlap_record RECORD;
BEGIN
    -- 1. Identify Overlaps and create insights
    FOR overlap_record IN SELECT * FROM public.get_subscription_overlaps(p_user_id) LOOP
        -- Only insert if not exists
        IF NOT EXISTS (SELECT 1 FROM public.intelligence_insights WHERE user_id = p_user_id AND insight_type = 'overlap' AND title ILIKE '%' || overlap_record.category || '%') THEN
            INSERT INTO public.intelligence_insights (user_id, insight_type, title, message)
            VALUES (
                p_user_id, 
                'overlap', 
                'Sobreposição em ' || overlap_record.category,
                'Encontrámos ' || overlap_record.count || ' subscrições de ' || overlap_record.category || '. Podes poupar dinheiro consolidando os teus serviços.'
            );
        END IF;
    END LOOP;

    -- 2. Identify Potential Savings (Monthly to Yearly)
    -- Just an example logic: suggest yearly for anything over 10/month
    INSERT INTO public.intelligence_insights (user_id, insight_type, title, message)
    SELECT 
        user_id, 
        'saving', 
        'Poupança Anual: ' || name,
        'Muda para o plano anual de ' || name || ' e poupa cerca de 15% por ano.'
    FROM public.subscriptions
    WHERE user_id = p_user_id 
    AND billing_type = 'monthly' 
    AND amount > 10
    AND NOT EXISTS (SELECT 1 FROM public.intelligence_insights WHERE user_id = p_user_id AND insight_type = 'saving' AND title ILIKE '%' || name || '%');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Done! ✅
-- =====================================================

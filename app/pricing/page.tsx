import React from 'react';
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/lib/utils/supabase/server";
import PricingPageClient from "@/components/landing/PricingPageClient";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative selection:bg-purple-500/30 transition-colors duration-500 overflow-x-hidden">
      <NavBarDemo user={user} />
      <PricingPageClient />
    </div>
  );
}

import LandingClient from "@/components/landing/LandingClient";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/lib/utils/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Kovr | Your smart subscription manager",
    description: "Manage your subscriptions, get renewal alerts and discover where you can save money every month. Never pay for services you don't use again.",
};

export default async function HomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <main>
            <NavBarDemo user={user} />
            <LandingClient />
        </main>
    );
}

import LandingClient from "@/components/landing/LandingClient";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/lib/utils/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Kovr - Smart Subscription Manager",
    description: "Track, manage, and optimize your recurring expenses in one place.",
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

import LandingClient from "@/components/landing/LandingClient";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/utils/supabase/server";

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

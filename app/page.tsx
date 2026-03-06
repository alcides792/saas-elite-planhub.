import LandingClient from "@/components/landing/LandingClient";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/lib/utils/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Kovr | O teu gestor inteligente de assinaturas",
    description: "Gere as tuas subscrições, recebe alertas de renovação e descobre onde podes poupar dinheiro todos os meses. Nunca mais pagues por serviços que não usas.",
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

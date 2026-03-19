import LandingClient from "@/components/landing/LandingClient";
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import { createClient } from "@/lib/utils/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Kovr | Your smart subscription manager",
    description: "Manage your subscriptions, get renewal alerts and discover where you can save money every month. Never pay for services you don't use again.",
    alternates: {
        canonical: 'https://kovr.space',
    },
};

export default async function HomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const softwareAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Kovr",
        "operatingSystem": "Web",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "description": "Manage your subscriptions, get renewal alerts and discover where you can save money every month."
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
            />
            <NavBarDemo user={user} />
            <LandingClient />
        </main>
    );
}

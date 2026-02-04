"use client";

import { ShieldCheck, Bot, Search, Bell, PiggyBank } from "lucide-react";
import RadialOrbitalTimeline from "./ui/radial-orbital-timeline";

const kovrJourney = [
    {
        id: 1,
        title: "Secure Connection",
        date: "Step 1",
        content: "End-to-end encrypted connection with your banks. Your data is never stored, only read.",
        category: "Security",
        icon: ShieldCheck,
        relatedIds: [2],
        status: "completed" as const,
        energy: 100,
    },
    {
        id: 2,
        title: "AI Scan",
        date: "Step 2",
        content: "Our AI scans your financial history searching for hidden subscription patterns.",
        category: "AI Analysis",
        icon: Bot,
        relatedIds: [1, 3],
        status: "completed" as const,
        energy: 90,
    },
    {
        id: 3,
        title: "Detection",
        date: "Step 3",
        content: "We find subscriptions you no longer use. Example: A free trial that turned into a $29.90 charge.",
        category: "Insights",
        icon: Search,
        relatedIds: [2, 4],
        status: "in-progress" as const,
        energy: 75,
    },
    {
        id: 4,
        title: "Alerts",
        date: "Step 4",
        content: "We set up automatic alerts. You'll receive a notification 3 days before the next bill.",
        category: "Protection",
        icon: Bell,
        relatedIds: [3, 5],
        status: "pending" as const,
        energy: 85,
    },
    {
        id: 5,
        title: "Savings",
        date: "Result",
        content: "Money in your pocket! Kovr users save an average of $300 in the first month.",
        category: "Savings",
        icon: PiggyBank,
        relatedIds: [4],
        status: "pending" as const,
        energy: 100,
    },
];

export function OrbitalDemo() {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    How <span className="text-purple-500">Kovr</span> works for you
                </h2>
                <p className="text-zinc-400 max-w-xl mx-auto px-6">
                    From the moment you connect until the savings hit your account. All automatic.
                </p>
            </div>

            <div className="h-[700px] w-full relative">
                <RadialOrbitalTimeline timelineData={kovrJourney} />
            </div>
        </section>
    );
}

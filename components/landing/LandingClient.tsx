'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Minus, Check } from 'lucide-react';
import Link from 'next/link';

import { TestimonialsSection } from "@/components/landing/ui/testimonials-columns";
// New Modular Components
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import NotificationChannels from "@/components/landing/NotificationChannels";

export default function LandingClient() {


    const FAQSection = () => {
        const [openIndex, setOpenIndex] = React.useState<number | null>(null);

        const faqs = [
            { q: "How does Kovr track my subscriptions?", a: "Kovr securely analyzes your transaction history using bank-level encrypted connections to identify recurring payments." },
            { q: "Is it safe to connect my accounts?", a: "Absolutely. We use AES-256 encryption. We never see your login credentials and only have read access to transaction data." },
            { q: "How does the detection extension work?", a: "Our extension automatically identifies subscription services as you browse, helping you keep an up-to-date inventory." },
            { q: "Can I manage everything from my phone?", a: "Yes! Kovr is fully responsive and you can receive alerts directly on Telegram or Discord." },
            { q: "What happens after the trial period?", a: "If you love Kovr (and the savings!), you'll transition to our Pro plan. You can cancel at any time with zero friction." }
        ];

        return (
            <section id="faq" className="py-24 px-6 border-t-8 border-[#1a1a1a] bg-zinc-50 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black mb-20 text-center text-[#1a1a1a] uppercase tracking-tighter leading-none">
                        QUESTIONS? <br /> <span className="text-[#faed27] bg-[#1a1a1a] px-4">WE HAVE ANSWERS.</span>
                    </h2>

                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a]">
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full p-8 flex justify-between items-center text-left group"
                                >
                                    <span className="text-xl md:text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">{faq.q}</span>
                                    <div className={`p-2 border-4 border-[#1a1a1a] bg-[#1fe2c3] transition-transform duration-0 ${openIndex === idx ? 'rotate-180 scale-110' : ''}`}>
                                        {openIndex === idx ? <Minus className="w-6 h-6 stroke-[4px]" /> : <Plus className="w-6 h-6 stroke-[4px]" />}
                                    </div>
                                </button>
                                {openIndex === idx && (
                                    <div className="px-8 pb-8 border-t-4 border-[#1a1a1a] bg-white">
                                        <p className="pt-6 text-xl text-[#1a1a1a] font-bold leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const testimonials = [
        {
            quote: "Kovr spotted three 'ghost' subscriptions I hadn't used in months. It literally paid for itself in the first ten minutes.",
            name: "Sarah Chen",
            designation: "Product Manager at TechFlow",
            src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
        },
        {
            quote: "The 1-click cancellation is a game changer. No more fighting with customer support just to stop a service.",
            name: "Michael Rodriguez",
            designation: "CTO at InnovateSphere",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "I love the early renewal alerts. I used to forget the end of free trials all the time, but not anymore.",
            name: "Emily Watson",
            designation: "Operations Director at CloudScale",
            src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
        },
        {
            quote: "Cleanest financial dashboard I've ever seen. The AI chat actually understands my questions about where my money goes.",
            name: "James Kim",
            designation: "Engineering Lead at DataPro",
            src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
        },
        {
            quote: "The ROI is insane. It's rare to find a product that saves you more money than it costs. Highly recommended.",
            name: "Lisa Thompson",
            designation: "VP of Technology at FutureNet",
            src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop",
        },
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen w-full bg-white dark:bg-black relative selection:bg-purple-500/30 transition-colors duration-500">
            {/* Theme-aware Background (Requested Light Mode Texture + Dark Mode Grid) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500 landing-bg"
            >
                <style jsx>{`
                    .landing-bg {
                        background-color: #ffffff;
                        background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0);
                        background-size: 20px 20px;
                    }
                    :global(.dark) .landing-bg {
                        background-color: #000000;
                        background-image: radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px);
                        background-size: 30px 30px;
                        background-position: 0 0;
                    }
                `}</style>
            </div>

            {/* New Modular Hero Section */}
            <header>
                <Hero />
            </header>

            <main>
                {/* Problem Section (The Pain) */}
                <section>
                    <ProblemSection />
                </section>

                {/* Notification Channels Section */}
                <section>
                    <NotificationChannels />
                </section>

                {/* New Modular Features Grid */}
                <section>
                    <Features />
                </section>

                {/* Pricing Section */}
                <section>
                    <Pricing />
                </section>

                <section>
                    <TestimonialsSection />
                </section>

                {/* FAQ Section with Brutalista Design & Logic */}
                <FAQSection />

                {/* Final CTA */}
                <section className="py-24 px-6 relative transition-colors duration-500">
                    <div className="max-w-5xl mx-auto text-center border-4 border-[#1a1a1a] p-16 bg-[#1fe2c3] relative overflow-hidden">
                        <h2 className="text-4xl md:text-7xl font-black text-[#1a1a1a] mb-8 tracking-tighter uppercase">Ready to take back <span className="underline">control?</span></h2>
                        <p className="text-xl md:text-2xl text-[#1a1a1a] mb-12 max-w-2xl mx-auto font-bold">
                            Join thousands of users who save an average of €300/year. Get started today.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link 
                                href="/login?mode=signup&plan=trial"
                                className="bg-[#1a1a1a] text-white px-12 py-6 font-black text-2xl border-4 border-[#1a1a1a] hover:bg-zinc-800 transition-all flex items-center justify-center"
                            >
                                Try Kovr for Free
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t-4 border-[#1a1a1a] px-6 relative z-10 bg-white dark:bg-black">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-[#1a1a1a] dark:text-white">
                        <Zap className="w-4 h-4 fill-current text-[#1a1a1a] dark:text-[#faed27]" />
                        <span className="font-bold uppercase tracking-tighter">Kovr</span>
                        <span className="text-xs ml-2 font-bold opacity-60">© 2025 Kovr AI. All rights reserved.</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold">
                        <Link href="/terms-of-service" className="text-[#1a1a1a] dark:text-white hover:underline transition-colors uppercase">Terms of Service</Link>
                        <Link href="/privacy-policy" className="text-[#1a1a1a] dark:text-white hover:underline transition-colors uppercase">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

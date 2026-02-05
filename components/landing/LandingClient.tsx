'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Check
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { TestimonialsSection } from "@/components/landing/ui/testimonials-columns";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import DemoSection from "@/components/landing/DemoSection";
import KineticDotsLoader from "@/components/ui/kinetic-dots-loader";

// New Modular Components
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import NotificationChannels from "@/components/landing/NotificationChannels";

export default function LandingClient() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

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
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <KineticDotsLoader />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen w-full bg-black relative selection:bg-purple-500/30"
                >
                    {/* Dark White Dotted Grid Background */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: "#000000",
                            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)`,
                            backgroundSize: "30px 30px",
                            backgroundPosition: "0 0",
                        }}
                    />

                    {/* New Modular Hero Section */}
                    <Hero />


                    {/* Problem Section (The Pain) */}
                    <ProblemSection />

                    {/* Interactive Product Demo */}
                    <InteractiveDemo />

                    {/* Video Demo Section */}
                    <DemoSection />

                    {/* Notification Channels Section */}
                    <NotificationChannels />

                    {/* New Modular Features Grid */}
                    <Features />

                    {/* Pricing Section */}
                    <Pricing />

                    <TestimonialsSection />

                    {/* FAQ */}
                    <section id="faq" className="py-24 px-6 border-t border-zinc-900">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-4xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {[
                                    { q: "How does Kovr track my subscriptions?", a: "Kovr securely analyzes your transaction history using bank-level encrypted connections to identify recurring payments and potential 'ghost' subscriptions." },
                                    { q: "Is it safe to connect my accounts?", a: "Absolutely. We use bank-grade AES-256 encryption. We never see your login credentials and only have read-only access to transaction data to identify subscriptions." },
                                    { q: "How does 1-click cancellation work?", a: "For participating services, Kovr automates the cancellation request process, or provides you with the exact link and steps needed to stop the charge instantly." },
                                    { q: "Can I manage everything from my phone?", a: "Yes! Kovr is fully responsive and also features a lightweight browser extension to help you track spending on the go." },
                                    { q: "What happens after the 3-day trial?", a: "If you love Kovr (and the savings!), you'll transition to our Pro Plan. You can cancel at any time during or after the trial with zero friction." }
                                ].map((item, i) => (
                                    <motion.div key={i} {...fadeInUp} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-colors">
                                        <h4 className="text-lg font-bold mb-2 text-white">{item.q}</h4>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-24 px-6 relative bg-gradient-to-b from-black to-purple-950/20">
                        <div className="max-w-5xl mx-auto text-center border border-white/10 p-16 rounded-[3rem] bg-zinc-900/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to regain <span className="text-gradient">control?</span></h2>
                            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                                Join 10,000+ users saving an average of $300/month. Start your free trial today.
                            </p>
                            <div className="flex flex-col md:flex-row justify-center gap-4">
                                <motion.button whileHover={{ scale: 1.05 }} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                                    Try Kovr Free for 3 Days
                                </motion.button>
                                <button className="bg-zinc-800 text-white px-12 py-5 rounded-2xl font-bold hover:bg-zinc-700">View Demo</button>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-12 border-t border-zinc-900 px-6">
                        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-2 opacity-50 text-white">
                                <Zap className="w-4 h-4 fill-white" /><span className="font-bold">Kovr</span>
                                <span className="text-xs ml-2 text-zinc-500">© 2024 Kovr AI. All rights reserved.</span>
                            </div>
                            <div className="flex gap-6 text-sm text-zinc-500">
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            </div>
                        </div>
                    </footer>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

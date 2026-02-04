'use client';

import React from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import {
    Zap,
    Check,
    X,
    Bot,
    Bell,
    BarChart3,
    ChevronRight,
    ShieldCheck,
    MousePointerClick
} from 'lucide-react';
import { useState } from 'react';

import { AnimatedTestimonials } from "@/components/landing/ui/animated-testimonials";
import { TestimonialsSection } from "@/components/landing/ui/testimonials-columns";
import { ContainerScroll } from "@/components/landing/ui/container-scroll-animation";
import Image from "next/image";
import { OrbitalDemo } from "@/components/landing/orbital-demo";
import { FeatureStepsDemo } from "@/components/landing/feature-steps-demo";

export default function LandingClient() {
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
        <div className="min-h-screen w-full bg-black relative selection:bg-purple-500/30">
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

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] glow-purple opacity-50 pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                            Stop burning <span className="text-gradient">money</span> on forgotten subscriptions
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Kovr uses AI to track your spending, alert you about upcoming charges, and cancel what you don't use with a single tap.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-col items-center gap-6">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white text-zinc-950 px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-2 group transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            Start 3-Day Free Trial ⚡
                        </motion.button>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { icon: Check, text: "No credit card required" },
                                { icon: MousePointerClick, text: "1-click cancellation" },
                                { icon: ShieldCheck, text: "Secure Encryption" }
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                                    <badge.icon className="w-4 h-4 text-purple-500" />
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Hero Scroll Animation Section */}
            <section className="flex flex-col overflow-hidden -mt-20">
                <ContainerScroll
                    titleComponent={
                        <h2 className="text-4xl font-semibold text-white">
                            Unleash the power of <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-gradient">Smart Tracking</span>
                        </h2>
                    }
                >
                    <Image src="/hero-screenshot.png" alt="hero" height={720} width={1400} className="mx-auto rounded-2xl object-cover h-full object-left-top" draggable={false} />
                </ContainerScroll>
            </section>

            {/* Comparative Section */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">The Evolution of Your Wallet</h2>
                        <p className="text-zinc-500">Compare how you manage your finances today vs. with Kovr</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 relative">
                        <motion.div {...fadeInUp} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 opacity-60 text-white">
                                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">01</span>
                                The Slow Way
                            </h3>
                            <ul className="space-y-4">
                                {["Manual spreadsheets", "Forgetting trials", "Surprise charges", "Late discoveries"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-zinc-400">
                                        <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div {...fadeInUp} className="relative p-[1px] rounded-3xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-800 animate-pulse" />
                            <div className="relative bg-zinc-900 p-8 rounded-3xl h-full">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                    <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">02</span>
                                    The Kovr Way
                                </h3>
                                <ul className="space-y-4">
                                    {["Automatic AI Sync", "Early Alerts", "1-Click Cancellation", "Average $300 savings"].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-white font-medium">
                                            <Check className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <OrbitalDemo />
            <FeatureStepsDemo />

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <Bot className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 text-white">Financial AI</h3>
                            <p className="text-zinc-400">Chat with your spending. Ask any question and get insights instantly on where to save.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <Bell className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white">Smart Alerts</h3>
                            <p className="text-zinc-400">Never miss a renewal with intelligent 3-day buffer alerts sent to your phone.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <BarChart3 className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white">Advanced Analytics</h3>
                            <p className="text-zinc-400">Visualize your monthly spending habits with beautiful, easy-to-read charts.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <ShieldCheck className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white">Bank-Level Security</h3>
                            <p className="text-zinc-400">Your data is yours. We use AES-256 encryption to keep everything secure.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <Zap className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white">1-Click Cancel</h3>
                            <p className="text-zinc-400">Cancel unwanted services directly from Kovr. No more fighting with support.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-purple-500/50 transition-colors">
                            <MousePointerClick className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-white">Browser Extension</h3>
                            <p className="text-zinc-400">Connect and manage from anywhere with our lightweight Chrome extension.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">An investment that pays for itself</h2>
                    <p className="text-zinc-500 mb-16 text-lg">Choose the plan that fits your financial journey.</p>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Free Plan */}
                        <motion.div {...fadeInUp} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] text-left">
                            <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Free</span>
                            <div className="my-6">
                                <span className="text-5xl font-black text-white">$0</span>
                                <span className="text-zinc-500 ml-2">/ month</span>
                            </div>
                            <ul className="space-y-4 mb-10 text-zinc-400">
                                {["Up to 3 Subscriptions", "Daily Sync", "Basic Alerts", "Manual Tracking"].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /><span>{f}</span></li>
                                ))}
                            </ul>
                            <button className="w-full bg-zinc-800 text-white py-4 rounded-xl font-bold hover:bg-zinc-700 transition-colors">Start Free</button>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative p-[2px] rounded-[2rem] bg-gradient-to-br from-purple-400 to-purple-800 shadow-2xl scale-110 z-10"
                        >
                            <div className="bg-zinc-950 rounded-[1.9rem] p-10 text-center text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-purple-600 px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase">Most Popular</div>
                                <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">Pro Plan</span>
                                <div className="my-6">
                                    <span className="text-6xl font-black">$27</span>
                                    <span className="text-purple-400 ml-2">/ year</span>
                                </div>
                                <ul className="text-left space-y-4 mb-10 text-zinc-300">
                                    {["Unlimited Management", "24/7 AI Support", "Smart Buffer Alerts", "Data Export (CSV/HTML)", "1-Click Cancellation"].map((f, i) => (
                                        <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /><span>{f}</span></li>
                                    ))}
                                </ul>
                                <motion.button whileHover={{ scale: 1.05 }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-purple-500 transition-colors">Secure my spot ⚡</motion.button>
                            </div>
                        </motion.div>

                        {/* Lifetime Plan */}
                        <motion.div {...fadeInUp} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] text-left">
                            <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Lifetime</span>
                            <div className="my-6">
                                <span className="text-5xl font-black text-white">$97</span>
                                <span className="text-zinc-500 ml-2">/ once</span>
                            </div>
                            <ul className="space-y-4 mb-10 text-zinc-400">
                                {["All Pro Features", "Lifetime Access", "Beta Feature Access", "Priority Support"].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /><span>{f}</span></li>
                                ))}
                            </ul>
                            <button className="w-full bg-zinc-800 text-white py-4 rounded-xl font-bold hover:bg-zinc-700 transition-colors">Go Lifetime</button>
                        </motion.div>
                    </div>
                </div>
            </section>

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
        </div>
    );
}

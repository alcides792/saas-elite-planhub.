"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Check, 
    ArrowRight, 
    Search, 
    Bell, 
    Bot, 
    Scissors, 
    BarChart3, 
    ShieldAlert
} from 'lucide-react';
import Footer from "@/components/landing/Footer";
import { trackClick } from "@/lib/utils/analytics-hits";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const detailedFeatures = [
    {
        category: "Detection",
        features: [
            { icon: Search, name: "Auto-Scan", detail: "Scan Gmail receipts." },
            { icon: Search, name: "Chrome Ext", detail: "Detects as you browse." },
            { icon: Search, name: "CSV Import", detail: "Bulk bank imports." }
        ]
    },
    {
        category: "Alerts",
        features: [
            { icon: Bell, name: "Multi-Channel", detail: "Telegram & Discord." },
            { icon: Bell, name: "Price Alerts", detail: "Notifies rate changes." },
            { icon: Bot, name: "AI Chat", detail: "Ask about spending." }
        ]
    },
    {
        category: "Control",
        features: [
            { icon: Scissors, name: "1-Click Cancel", detail: "Direct cancel links." },
            { icon: ShieldAlert, name: "Ghost Finder", detail: "Identify unused apps." },
            { icon: BarChart3, name: "Analytics", detail: "Monthly cash flow." }
        ]
    }
];

const faqs = [
    { q: "Is the trial real?", a: "Yes, 72h free with full access." },
    { q: "Can I cancel?", a: "Yes, with one click in the dashboard." },
    { q: "Is it secure?", a: "Encryption via Stripe. Zero risk." }
];

export default function PricingPageClient() {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500 landing-bg opacity-30 dark:opacity-80">
          <style jsx>{`
              .landing-bg {
                  background-color: #ffffff;
                  background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0);
                  background-size: 20px 20px;
              }
              :global(.dark) .landing-bg {
                  background-color: #000000;
                  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 1.2px, transparent 1.2px);
                  background-size: 24px 24px;
              }
          `}</style>
      </div>
      
      <main className="relative z-10 pt-32 pb-16">
        {/* Header - More compact */}
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white mb-4 leading-none italic">
            STOP <span className="text-blue-600">LEAKING</span> MONEY
          </h1>
          <p className="text-lg md:text-xl font-black text-[#1a1a1a]/70 dark:text-zinc-400 italic uppercase">
            One Plan. All Features. Instant Savings.
          </p>
        </header>

        {/* Pricing Card - Scaled down */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
            <div className="flex justify-center">
                <motion.div
                    {...fadeInUp}
                    className="bg-white dark:bg-zinc-900 border-4 border-[#1a1a1a] dark:border-white p-8 md:p-10 text-left flex flex-col shadow-[12px_12px_0px_#1a1a1a] dark:shadow-[12px_12px_0px_rgba(255,255,255,0.05)] transition-all relative overflow-hidden w-full max-w-lg"
                >
                    <div className="absolute top-0 right-0 bg-[#faed27] text-[#1a1a1a] px-5 py-2 text-xs font-black uppercase border-l-4 border-b-4 border-[#1a1a1a] dark:border-white">
                        VOTED #1
                    </div>
                    
                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-[#1a1a1a] px-3 py-1 border-2 border-[#1a1a1a] self-start mb-6 italic">
                        KOVR PRO
                    </span>

                    <div className="mb-6 border-b-4 border-[#1a1a1a] dark:border-zinc-800 pb-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl md:text-7xl font-black text-[#1a1a1a] dark:text-white leading-none">$27</span>
                            <span className="text-slate-500 font-black text-lg lowercase italic">/ year</span>
                        </div>
                    </div>

                    <div className="bg-[#1fe2c3] p-3 border-4 border-[#1a1a1a] dark:border-white mb-8 transform -rotate-1 shadow-[4px_4px_0px_#1a1a1a]">
                        <p className="text-[#1a1a1a] font-black text-lg uppercase italic leading-none">3-DAY FREE TRIAL</p>
                    </div>

                    <ul className="space-y-3 mb-10 text-[#1a1a1a] dark:text-zinc-300 font-black text-sm uppercase italic">
                        {[
                            "Unlimited Tracking",
                            "AI Spending Insights",
                            "Telegram/Discord Alerts",
                            "Auto-Detect Extension",
                            "1-Click Cancellation"
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <Check className="text-blue-600" size={16} strokeWidth={4} />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    <Link 
                        href="/login?mode=signup&plan=trial"
                        onClick={() => trackClick("/login?mode=signup&plan=trial")}
                        className="w-full bg-[#1a1a1a] text-white py-5 border-4 border-[#1a1a1a] dark:border-white font-black text-xl hover:bg-zinc-800 transition-all uppercase shadow-[4px_4px_0px_#1fe2c3] flex items-center justify-center gap-3 group"
                    >
                        START TRIAL <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>

        {/* Detailed Features - Optimized layout */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] dark:text-white mb-12 text-center uppercase italic">
                WHY <span className="text-blue-600">PRO?</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {detailedFeatures.map((cat, i) => (
                    <div key={i} className="space-y-6">
                        <div className="inline-block px-4 py-1 bg-[#faed27] border-2 border-[#1a1a1a] font-black uppercase italic text-sm shadow-[3px_3px_0px_#1a1a1a]">
                            {cat.category}
                        </div>
                        <div className="space-y-4">
                            {cat.features.map((feat, j) => (
                                <div key={j} className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 w-8 h-8 border-2 border-[#1a1a1a] dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_#1a1a1a]">
                                        <feat.icon size={14} className="text-blue-600" />
                                    </div>
                                    <div className="leading-none pt-1">
                                        <h4 className="text-sm font-black text-[#1a1a1a] dark:text-white uppercase italic">{feat.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{feat.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contrast Section - Compact */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
            <div className="bg-[#1a1a1a] border-4 border-[#1a1a1a] p-8 md:p-12 shadow-[12px_12px_0px_#faed27]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-[#ff6b6b] font-black text-sm uppercase italic mb-4">COMPETITORS</p>
                        <ul className="space-y-2 text-white/60 text-xs font-bold uppercase italic">
                            <li>- Expensive monthly subs</li>
                            <li>- Selling your data</li>
                            <li>- Manual tracking only</li>
                        </ul>
                    </div>
                    <div className="border-t-2 md:border-t-0 md:border-l-2 border-white/10 pt-6 md:pt-0 md:pl-8">
                        <p className="text-[#1fe2c3] font-black text-sm uppercase italic mb-4">KOVR PRO</p>
                        <ul className="space-y-2 text-white text-xs font-black uppercase italic">
                            <li className="flex items-center gap-2"><Check className="text-[#1fe2c3]" size={12} strokeWidth={4} /> $27 / Year</li>
                            <li className="flex items-center gap-2"><Check className="text-[#1fe2c3]" size={12} strokeWidth={4} /> Privacy First</li>
                            <li className="flex items-center gap-2"><Check className="text-[#1fe2c3]" size={12} strokeWidth={4} /> Auto-Detection</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ & CTA - Joined and Compact */}
        <section className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-2 border-[#1a1a1a] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-[4px_4px_0px_#1a1a1a]">
                            <h4 className="text-sm font-black text-[#1a1a1a] dark:text-white uppercase italic mb-1">{faq.q}</h4>
                            <p className="text-[11px] text-slate-500 font-bold italic">{faq.a}</p>
                        </div>
                    ))}
                </div>
                
                <div className="bg-[#1fe2c3] border-4 border-[#1a1a1a] p-10 text-center shadow-[10px_10px_0px_#1a1a1a]">
                    <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 uppercase italic leading-none">READY?</h2>
                    <Link 
                        href="/login?mode=signup&plan=trial"
                        className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-4 font-black text-lg uppercase tracking-tighter hover:shadow-[4px_4px_0px_white] transition-all"
                    >
                        START NOW <ArrowRight size={20} strokeWidth={3} />
                    </Link>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

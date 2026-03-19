"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  ScanSearch, 
  BellRing, 
  Ghost, 
  Scissors, 
  BotMessageSquare, 
  PieChart, 
  Tags, 
  FileDown
} from 'lucide-react';
import Footer from "@/components/landing/Footer";

const allFeatures = [
    {
        title: "Auto-Detection Extension",
        description: "Automatically scans your digital receipts and emails to identify active subscriptions without any manual data entry.",
        icon: ScanSearch,
        color: "bg-[#1fe2c3]"
    },
    {
        title: "Smart Renewal Alerts",
        description: "Never miss a cancellation window again. Get pinged on Telegram, Discord, or Email exactly 3 days before any renewal charge.",
        icon: BellRing,
        color: "bg-[#faed27]"
    },
    {
        title: "Ghost Subscriptions Radar",
        description: "Kovr AI systematically spots inactive services you haven't used in months but are still paying for. Realize instant savings.",
        icon: Ghost,
        color: "bg-purple-500 text-white"
    },
    {
        title: "1-Click Cancellation",
        description: "Stop fighting with hidden customer support pages. We provide direct cancellation links and email templates for every major service.",
        icon: Scissors,
        color: "bg-[#ff6b6b]"
    },
    {
        title: "Ask Kovr AI",
        description: "Talk to your data naturally. Ask questions like 'How much did I spend on streaming this year?' and get instant, accurate answers.",
        icon: BotMessageSquare,
        color: "bg-blue-500 text-white"
    },
    {
        title: "Detailed Analytics",
        description: "A crystal-clear dashboard. Visualize your cash flow, identify spending trends, and see exactly where your money goes every month.",
        icon: PieChart,
        color: "bg-emerald-400"
    },
    {
        title: "Custom Categories",
        description: "Organize your expenditures your way. Group your services by 'Entertainment', 'Work', or create your own custom tags.",
        icon: Tags,
        color: "bg-orange-400"
    },
    {
        title: "Professional Exports",
        description: "Need to analyze data in Excel or send to your accountant? Download detailed, clean statements in PDF or CSV formats instantly.",
        icon: FileDown,
        color: "bg-pink-400"
    }
];

export default function FeaturesPageClient() {
  return (
    <>
      {/* Landing Background Style */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500 landing-bg opacity-50 dark:opacity-100">
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

      <main className="relative z-10 pt-40 pb-24">
        {/* Header */}
        <header className="max-w-6xl mx-auto px-6 mb-32 text-center">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white mb-8 leading-[0.85] italic">
            EVERYTHING YOU NEED TO <span className="text-[#1fe2c3]">CONTROL</span>
          </h1>
          <p className="text-xl md:text-3xl font-black text-[#1a1a1a]/80 dark:text-zinc-400 max-w-4xl mx-auto italic uppercase">
            WE BUILT THE TECH SO YOU NEVER LOSE CONTROL OF YOUR DIGITAL SPENDING AGAIN
          </p>
        </header>

        {/* Features Grid - Brutalist Style */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {allFeatures.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative p-8 bg-white dark:bg-zinc-900 border-4 border-[#1a1a1a] dark:border-zinc-800 hover:translate-x-[-8px] hover:translate-y-[-8px] hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] transition-all"
              >
                <div className={`w-16 h-16 border-4 border-[#1a1a1a] dark:border-zinc-800 flex items-center justify-center mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform ${feature.color}`}>
                  <feature.icon size={32} className={feature.color.includes('text-white') ? 'text-white' : 'text-[#1a1a1a]'} />
                </div>
                
                <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 uppercase tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-[#1a1a1a]/80 dark:text-zinc-400 font-bold text-lg leading-snug italic">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section - Brutalist Style */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="bg-[#faed27] border-8 border-[#1a1a1a] p-12 md:p-24 text-center relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(26,26,26,1)]">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black text-[#1a1a1a] mb-8 tracking-tighter uppercase leading-none italic">
                STOP LEAKING MONEY.
              </h2>
              <p className="text-xl md:text-3xl font-black text-[#1a1a1a]/90 mb-12 max-w-3xl mx-auto uppercase italic">
                Join thousands of smart users who are already saving hundreds of dollars a year with Kovr.
              </p>
              
              <Link 
                  href="/login?mode=signup"
                  className="inline-flex items-center gap-4 bg-[#1a1a1a] text-white px-10 py-6 font-black text-2xl uppercase tracking-tighter hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(31,226,195,1)] transition-all active:scale-95"
              >
                  Start Saving Today <ArrowRight size={28} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

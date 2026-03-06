'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap
} from 'lucide-react';

import { TestimonialsSection } from "@/components/landing/ui/testimonials-columns";
import InteractiveDemo from "@/components/landing/InteractiveDemo";

// New Modular Components
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import NotificationChannels from "@/components/landing/NotificationChannels";

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
        <div className="min-h-screen w-full bg-white dark:bg-black relative selection:bg-purple-500/30 transition-colors duration-500">
            {/* Theme-aware Background (Requested Light Mode Texture + Dark Mode Grid) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500"
            >
                <style jsx>{`
                    div {
                        background-color: #ffffff;
                        background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0);
                        background-size: 20px 20px;
                    }
                    :global(.dark) div {
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

                {/* Interactive Product Demo */}
                <section>
                    <InteractiveDemo />
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

                {/* FAQ */}
                <section id="faq" className="py-24 px-6 border-t-4 border-[#1a1a1a]">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-16 text-center text-[#1a1a1a] dark:text-white uppercase tracking-tighter">Perguntas Frequentes</h2>
                        <div className="space-y-6">
                            {[
                                { q: "Como é que o Kovr rastreia as minhas assinaturas?", a: "O Kovr analisa de forma segura o teu histórico de transações utilizando ligações encriptadas de nível bancário para identificar pagamentos recorrentes." },
                                { q: "É seguro ligar as minhas contas?", a: "Absolutamente. Utilizamos encriptação AES-256. Nunca vemos as tuas credenciais de login e apenas temos acesso de leitura aos dados de transações." },
                                { q: "Como funciona a extensão de detecção?", a: "A nossa extensão identifica automaticamente serviços de subscrição enquanto navegas, ajudando-te a manter um inventário sempre atualizado." },
                                { q: "Posso gerir tudo pelo telemóvel?", a: "Sim! O Kovr é totalmente responsivo e podes receber alertas diretamente no Telegram ou Discord." },
                                { q: "O que acontece depois do período experimental?", a: "Se adorares o Kovr (e as poupanças!), transitas para o nosso plano Pro. Podes cancelar a qualquer momento sem qualquer atrito." }
                            ].map((item, i) => (
                                <motion.div key={i} {...fadeInUp} className="bg-white p-8 border-4 border-[#1a1a1a] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                                    <h4 className="text-xl font-black mb-4 text-[#1a1a1a]">{item.q}</h4>
                                    <p className="text-[#1a1a1a]/80 text-lg font-medium leading-relaxed">{item.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 relative transition-colors duration-500">
                    <div className="max-w-5xl mx-auto text-center border-4 border-[#1a1a1a] p-16 bg-[#1fe2c3] relative overflow-hidden">
                        <h2 className="text-4xl md:text-7xl font-black text-[#1a1a1a] mb-8 tracking-tighter uppercase">Pronto para retomar o <span className="underline">controlo?</span></h2>
                        <p className="text-xl md:text-2xl text-[#1a1a1a] mb-12 max-w-2xl mx-auto font-bold">
                            Junta-te a milhares de utilizadores que poupam uma média de 300€/ano. Começa hoje mesmo.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <motion.button whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] text-white px-12 py-6 font-black text-2xl border-4 border-[#1a1a1a] hover:bg-zinc-800 transition-all">
                                Experimentar Kovr Grátis
                            </motion.button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t-4 border-[#1a1a1a] px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-[#1a1a1a]">
                        <Zap className="w-4 h-4 fill-current" /><span className="font-bold uppercase tracking-tighter">Kovr</span>
                        <span className="text-xs ml-2 font-bold opacity-60">© 2024 Kovr AI. Todos os direitos reservados.</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold">
                        <a href="#" className="hover:underline transition-colors uppercase">Termos</a>
                        <a href="#" className="hover:underline transition-colors uppercase">Privacidade</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

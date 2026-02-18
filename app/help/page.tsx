'use client';

import React from 'react';
import Link from 'next/link';
import { LifeBuoy, Mail, ArrowLeft, Construction } from 'lucide-react';
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';

/**
 * HelpCenterContent - The Help Center page content that consumes the layout context for theme support.
 */
function HelpCenterContent() {
    const { theme } = useLayout();

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-zinc-900'
            }`}>
            {/* Background effect to maintain PlanHub visual identity */}
            {theme === 'dark' ? (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: "#000000",
                        backgroundImage: `
                            linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />
            ) : (
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-20"
                    style={{
                        background: "radial-gradient(circle at 50% 50%, #f1f5f9 0%, #e2e8f0 100%)",
                        backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                    }}
                />
            )}

            <div className="max-w-2xl w-full relative z-10 animate-fade-in">
                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-8 group"
                >
                    <div className="p-2 rounded-xl bg-white/5 border border-black/5 dark:border-white/10 group-hover:bg-violet-500 group-hover:text-white transition-all shadow-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">Back to Dashboard</span>
                </Link>

                {/* Main Help Center Card */}
                <div className="plan-hub-card p-10 lg:p-16 text-center space-y-10 overflow-hidden border-violet-500/20">
                    {/* Top shimmer line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

                    {/* Seção de Ícone */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                            <div className="relative p-7 rounded-[2.5rem] bg-violet-500/10 border border-violet-500/20 text-violet-500 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                                <LifeBuoy size={64} strokeWidth={1.2} className="animate-[spin_20s_linear_infinite]" />
                                <div className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-violet-600 text-white shadow-xl border-2 border-white dark:border-zinc-900">
                                    <Construction size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo de Texto */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <span className="text-xs font-black tracking-[0.3em] text-violet-500 uppercase opacity-80">Premium Support</span>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white">
                                Help <span className="bg-gradient-to-r from-violet-400 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Center</span>
                            </h1>
                        </div>

                        <div className="space-y-8 max-w-lg mx-auto">
                            <div className="p-6 rounded-2xl bg-violet-500/5 border border-violet-500/10 dark:bg-zinc-800/30 backdrop-blur-sm">
                                <p className="text-zinc-600 dark:text-zinc-400 text-lg lg:text-xl leading-relaxed">
                                    This page is currently under maintenance. It will be back soon with more tips and help to improve your experience.
                                </p>
                            </div>

                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                                Have a question? <br />
                                <span className="text-zinc-500 dark:text-zinc-500 mt-1 block">Ask our team.</span>
                            </h2>
                        </div>
                    </div>

                    {/* Botão de Chamada para Ação */}
                    <div className="pt-4">
                        <a
                            href="mailto:planhub.help@gmail.com"
                            className="inline-flex items-center gap-4 px-12 py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-600/50 transition-all active:scale-95 group"
                        >
                            <Mail size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span>Contact Support</span>
                        </a>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-10 flex flex-col items-center gap-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
                        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
                            planhub.help@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * HelpCenterPage - Exported main page.
 * We wrap the content in LayoutProvider to ensure theme (dark/light) is respected.
 */
export default function HelpCenterPage() {
    return (
        <LayoutProvider>
            <HelpCenterContent />
        </LayoutProvider>
    );
}

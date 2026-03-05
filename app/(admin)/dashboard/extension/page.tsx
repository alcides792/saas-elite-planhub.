'use client';

import { useState } from 'react';
import {
    Puzzle,
    Download,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Copy,
    ExternalLink,
    ShieldCheck,
    Terminal,
    Chrome
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProModal from '@/components/ProModal';

const BentoCard = ({ children, className = "", title, icon: Icon, description, badge }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 p-8 hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem] ${className}`}
    >
        {/* Subtle Gradient Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 blur-[80px] rounded-full group-hover:bg-purple-600/10 transition-colors duration-700" />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                    {Icon && (
                        <div className="p-4 bg-black/5 dark:bg-zinc-800/50 rounded-2xl border border-black/5 dark:border-white/5 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-all duration-500 shadow-inner">
                            <Icon size={26} />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
                            {badge && (
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-500/20">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium leading-relaxed mt-1">{description}</p>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    </motion.div>
);

export default function ExtensionPage() {
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProModalOpen, setIsProModalOpen] = useState(false);

    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/extension/connect/generate', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error generating code');

            setCode(data.code);
        } catch (err: any) {
            const errorMsg = err.message || "Error generating code";
            setError(errorMsg);

            if (errorMsg.includes("Blocked") || errorMsg.includes("Pro")) {
                setIsProModalOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-1 border border-purple-500 animate-pulse rounded-full" />
                    <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[11px]">System Integration</span>
                </div>
                <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                    Kovr Extension
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 font-medium max-w-2xl">
                    Connect your browser to sync subscriptions automatically. Kovr Extension detects active subscriptions on your favorite services.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Official Download Card */}
                <BentoCard
                    title="Official Store"
                    icon={Chrome}
                    description="Available now on the Chrome Web Store"
                    badge="Official"
                    className="lg:col-span-12 xl:col-span-5"
                >
                    <div className="mt-4 space-y-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-purple-500/20 rounded-[2.5rem] relative group overflow-hidden">
                            {/* Animated Circuit line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 animate-pulse" />

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 flex items-center justify-center p-4">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg"
                                        alt="Chrome"
                                        width={48}
                                        height={48}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">Kovr for Chrome</h4>
                                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest">
                                        <ShieldCheck size={14} />
                                        Verified by Google
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed">
                                Our extension is now official. Download it directly from the Chrome Web Store for the best security and automatic updates.
                            </p>

                            <a
                                href="https://chrome.google.com/webstore/detail/kovr-assistant/..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-5 rounded-2xl font-black text-sm transition-all hover:bg-purple-700 hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-500/20"
                            >
                                <Download size={20} />
                                DOWNLOAD ON CHROME WEB STORE
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </BentoCard>

                {/* 2. Connection Token Card */}
                <BentoCard
                    title="Connect Your Account"
                    icon={Puzzle}
                    description="Sync your data securely with a connection code"
                    className="lg:col-span-12 xl:col-span-7"
                >
                    <div className="mt-4 space-y-6">
                        <div className="p-8 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            {!code ? (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-500">
                                        <RefreshCw size={32} className={loading ? "animate-spin" : ""} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Disconnected</h4>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                        Generate a unique 6-digit code to authorize the Kovr extension to sync with your account.
                                    </p>
                                    <button
                                        onClick={generateCode}
                                        disabled={loading}
                                        className="inline-flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? "GENERATING..." : "GENERATE CONNECTION CODE"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] block mb-2">
                                                ACCESS TOKEN
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <code className="text-6xl font-mono font-black text-purple-600 dark:text-purple-400 tracking-[0.1em]">
                                                    {code}
                                                </code>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`p-4 rounded-2xl transition-all duration-300 ${copied
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-purple-500'
                                                        }`}
                                                >
                                                    {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                                            This code is valid for 10 minutes. Enter it in your browser extension immediately.
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                        <h5 className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-4">INSTRUCTIONS</h5>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { step: "01", text: "Download and install the Kovr Chrome Extension." },
                                                { step: "02", text: "Open the extension popup in your browser." },
                                                { step: "03", text: "Paste the 6-digit code above." },
                                                { step: "04", text: "Wait for the 'Success' notification." }
                                            ].map((item, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <span className="text-purple-500 font-mono font-black">{item.step}</span>
                                                    <p className="text-xs font-medium text-gray-600 dark:text-zinc-400 leading-relaxed">{item.text}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </BentoCard>
            </div>

            <ProModal
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
            />

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s infinite;
                }
            `}</style>
        </div>
    );
}

// Separate component for Image to avoid issues if next/image is used inside 'use client' without proper boundary
import Image from 'next/image';

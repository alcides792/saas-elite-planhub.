'use client';

import { useState, useEffect, useRef } from 'react';
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
    Chrome,
    PartyPopper,
    Unplug
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProModal from '@/components/ProModal';

// Simplified Premium Card Component
const PremiumCard = ({ children, className = "", title, description }: any) => (
    <div className={`bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-8 rounded-xl shadow-sm dark:shadow-none flex flex-col h-full ${className}`}>
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{description}</p>}
        </div>
        <div className="flex-1 flex flex-col justify-between">
            {children}
        </div>
    </div>
);

export default function ExtensionPage() {
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const [extensionConnected, setExtensionConnected] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Check extension status on page mount (detects pre-existing connections)
    useEffect(() => {
        const checkInitialStatus = async () => {
            try {
                const res = await fetch('/api/extension/status');
                if (res.ok) {
                    const data = await res.json();
                    if (data.connected) {
                        setExtensionConnected(true);
                    }
                }
            } catch {
                // Silently ignore
            } finally {
                setInitialCheckDone(true);
            }
        };
        checkInitialStatus();
    }, []);

    // Poll for extension connection status every 3 seconds after code is generated
    useEffect(() => {
        if (!code || extensionConnected) return;

        const pollStatus = async () => {
            try {
                const res = await fetch('/api/extension/status');
                if (res.ok) {
                    const data = await res.json();
                    if (data.connected) {
                        setExtensionConnected(true);
                        // Stop polling
                        if (pollingRef.current) {
                            clearInterval(pollingRef.current);
                            pollingRef.current = null;
                        }
                    }
                }
            } catch {
                // Silently ignore polling errors
            }
        };

        // Start polling
        pollingRef.current = setInterval(pollStatus, 3000);

        // Also check immediately
        pollStatus();

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [code, extensionConnected]);

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

    const handleDisconnect = async () => {
        setDisconnecting(true);
        try {
            const res = await fetch('/api/extension/disconnect', { method: 'POST' });
            if (res.ok) {
                setExtensionConnected(false);
                setCode(null);
            }
        } catch {
            // Silently ignore
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12">
            {/* Header Section */}
            <div className="mb-12">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight uppercase mb-2">
                    Kovr Extension
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl">
                    Connect your browser to sync subscriptions automatically. Kovr Extension detects active subscriptions on your favorite services.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Official Download Card */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <PremiumCard
                        title="Google Chrome Extension"
                        description="Step 1: Install our official extension to enable one-click subscription tracking."
                    >
                        <div className="mt-4 flex flex-col justify-between h-full">
                            <div className="p-6 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center p-2 border border-gray-100 dark:border-white/5">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg"
                                            alt="Chrome"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Kovr for Chrome</h4>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                            <ShieldCheck size={12} className="text-gray-900 dark:text-white" />
                                            Verified by Google
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Download directly from the Chrome Web Store for the best security and automatic updates.
                                </p>
                            </div>

                            <a
                                href="https://chrome.google.com/webstore/detail/kovr-assistant/..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-md font-medium text-sm transition-colors hover:opacity-90"
                            >
                                <Download size={18} />
                                Install Extension
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </PremiumCard>
                </div>

                {/* 2. Connection Token Card */}
                <div className="lg:col-span-12 xl:col-span-7">
                    <PremiumCard
                        title="Connect Your Account"
                        description="Sync your data securely with a connection code"
                    >
                        <div className="mt-4 flex flex-col justify-center h-full">
                            <AnimatePresence mode="wait">
                                {extensionConnected ? (
                                    /* ✅ SUCCESS STATE */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-10 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                Status: Connected
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                                Your browser is successfully synced with your Kovr account.
                                            </p>
                                            
                                            <button
                                                onClick={handleDisconnect}
                                                disabled={disconnecting}
                                                className="mt-4 text-red-600 border border-red-200 hover:bg-red-50 dark:text-red-500 dark:border-red-900/50 dark:hover:bg-red-950/30 text-xs px-3 py-1.5 rounded-md transition-all font-medium uppercase tracking-widest disabled:opacity-50"
                                            >
                                                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : !code ? (
                                    /* DISCONNECTED STATE */
                                    <motion.div
                                        key="disconnected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-10 text-center"
                                    >
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-900 dark:text-white border border-gray-100 dark:border-white/5">
                                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">Disconnected</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                                            Generate a unique 6-digit code to authorize the Kovr extension to sync with your account.
                                        </p>
                                        <button
                                            onClick={generateCode}
                                            disabled={loading}
                                            className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-md font-medium text-sm transition-colors hover:opacity-90 disabled:opacity-50"
                                        >
                                            {loading ? "Generating..." : "Generate Code"}
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* CODE DISPLAY STATE */
                                    <motion.div
                                        key="code"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6 py-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-4 mb-4">
                                                <code className="text-5xl font-mono font-bold text-gray-900 dark:text-white tracking-[0.2em]">
                                                    {code}
                                                </code>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`p-2 rounded-md transition-all duration-300 ${copied
                                                        ? 'text-emerald-500 bg-emerald-500/10'
                                                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10'
                                                        }`}
                                                >
                                                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                                                <AlertCircle size={12} />
                                                Expires in 10 minutes
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                            <h5 className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Final Steps</h5>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                                {[
                                                    { step: "01", text: "Download the Chrome Extension (on the left)." },
                                                    { step: "02", text: "Open the extension popup in your browser." },
                                                    { step: "03", text: "Paste the 6-digit code shown above." },
                                                    { step: "04", text: "Wait for the 'Connected' status update." }
                                                ].map((item, i) => (
                                                    <li key={i} className="flex gap-3 items-start">
                                                        <span className="text-gray-900 dark:text-white font-mono font-bold text-[10px]">{item.step}</span>
                                                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight">{item.text}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </PremiumCard>
                </div>
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

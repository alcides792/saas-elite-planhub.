'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Puzzle, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UpgradeModal from '@/components/UpgradeModal';

export default function ConnectExtension() {
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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

            if (errorMsg.includes("Bloqueado") || errorMsg.includes("Pro")) {
                setIsUpgradeModalOpen(true);
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
        <div className="plan-hub-card p-6 border border-zinc-800 rounded-2xl bg-zinc-900/50 relative overflow-hidden group">
            {/* Background Decorative Gradient */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full group-hover:bg-purple-600/20 transition-colors duration-700" />

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Connect Extension
                        {code && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                Generated
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                        Generate a temporary 6-digit code to automatically sync your subscriptions with the extension.
                    </p>
                </div>

                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    <Puzzle size={24} />
                </div>
            </div>

            <div className="relative z-10 space-y-4">
                {!code ? (
                    <button
                        onClick={generateCode}
                        disabled={loading}
                        className="group relative flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-900/20"
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={18} className="animate-spin" />
                                GENERATING...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={18} />
                                GENERATE CONNECTION CODE
                            </>
                        )}
                    </button>
                ) : (
                    <div className="animate-fade-in space-y-3">
                        <div className="bg-black/40 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between group/code">
                            <div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-1">
                                    ACCESS CODE
                                </span>
                                <code className="text-3xl font-mono font-black text-purple-400 tracking-[0.2em]">
                                    {code}
                                </code>
                            </div>

                            <button
                                onClick={copyToClipboard}
                                className={`p-4 rounded-xl transition-all duration-300 ${copied
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-zinc-800/50 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700'
                                    }`}
                                title="Copy Code"
                            >
                                {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                            </button>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                            <AlertCircle size={14} className="text-amber-500 mt-0.5" />
                            <p className="text-[11px] text-amber-500/80 font-bold uppercase tracking-wider">
                                Valid for 10 minutes. Use immediately in the extension.
                            </p>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold"
                        >
                            <AlertCircle size={14} />
                            {error.toUpperCase()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />

            <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

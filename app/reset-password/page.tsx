'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                toast.error(updateError.message);
            } else {
                toast.success('Password updated! Redirecting to dashboard...');
                // Ensure the session is fresh before redirecting
                await supabase.auth.getSession();
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            }
        } catch (err) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0a0a0a]">

            {/* LADO ESQUERDO: Branding (Ultra Pro Split) */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-16 relative overflow-hidden border-r border-white/5">
                {/* NEON MESH GRADIENT EFFECT */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1fe2c3] opacity-[0.08] blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#1fe2c3] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                            <Image src="/logo.png" width={28} height={28} alt="Kovr" className="grayscale brightness-0" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Kovr</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <h2 className="text-6xl font-bold tracking-tighter leading-[1.1] mb-6 text-white text-balance">
                            Security first.
                        </h2>
                        <p className="text-gray-400 text-xl font-medium max-w-md leading-relaxed">
                            Protecting your digital footprint starts with a strong, secure password.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">
                        © 2026 KOVR LABS / ULTRA PRO
                    </p>
                </div>
            </div>

            {/* LADO DIREITO: Formulário (Minimalist Ultra Pro) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="w-full max-w-md">

                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-10 rounded-2xl shadow-none">
                        <div className="mb-8">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                New Password
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Set a new password for your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 mt-4 active:scale-[0.98] text-xs uppercase tracking-[0.2em]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Updating...</span>
                                    </span>
                                ) : (
                                    <>
                                        <span>Update Password</span>
                                        <ArrowRight size={14} strokeWidth={2.5} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-8 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] font-medium">
                        Securing your digital identity.
                    </p>
                </div>
            </div>
        </div>
    );
}

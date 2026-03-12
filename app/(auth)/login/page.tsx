'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Suspense } from 'react';

function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read mode and plan from URL
    const initialMode = (searchParams.get('mode') as 'signin' | 'signup' | 'forgot_password') || 'signin';
    const plan = searchParams.get('plan');

    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Update mode if URL param changes
    useEffect(() => {
        if (searchParams.get('mode')) {
            setMode(searchParams.get('mode') as any);
        }
    }, [searchParams]);

    const handleGoogleLogin = async () => {
        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${plan ? `?plan=${plan}` : ''}`,
                },
            });
            if (authError) toast.error(authError.message);
        } catch (err) {
            toast.error('Error connecting to Google.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                toast.error(resetError.message);
            } else {
                toast.success('Check your email for the reset link!');
            }
        } catch (err) {
            toast.error('An error occurred while sending the reset link.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'forgot_password') return handleResetPassword(e);

        setIsLoading(true);

        try {
            const supabase = createClient();
            if (mode === 'signin') {
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (authError) {
                    toast.error(authError.message);
                } else if (data.session) {
                    router.push('/dashboard');
                    router.refresh();
                }
            } else {
                const { data, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback${plan ? `?plan=${plan}` : ''}`,
                    }
                });

                if (authError) {
                    toast.error(authError.message);
                } else if (data.user) {
                    // CONVERSION FLOW LOGIC
                    if (plan === 'trial') {
                        try {
                            const res = await fetch('/api/billing/checkout', { method: 'POST' });
                            const checkoutData = await res.json();
                            if (checkoutData.checkoutUrl) {
                                router.push(checkoutData.checkoutUrl);
                                return;
                            }
                        } catch (checkoutErr) {
                            console.error("Failed to trigger checkout:", checkoutErr);
                            // Fallback to dashboard if checkout fails
                            router.push('/dashboard');
                        }
                    } else {
                        router.push('/dashboard');
                    }
                    router.refresh();
                }
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
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <h2 className="text-6xl font-bold tracking-tighter leading-[1.1] mb-6 text-white text-balance">
                                {mode === 'signin' && 'Welcome back.'}
                                {mode === 'signup' && 'Start your journey.'}
                                {mode === 'forgot_password' && 'Recover account.'}
                            </h2>
                            <p className="text-gray-400 text-xl font-medium max-w-md leading-relaxed">
                                {mode === 'signin' && 'Log in to manage your digital subscriptions with precision.'}
                                {mode === 'signup' && 'Join the next generation of subscription management.'}
                                {mode === 'forgot_password' && "Don't worry, we'll help you get back into your account."}
                            </p>
                        </motion.div>
                    </AnimatePresence>
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
                        <div className="mb-8 relative">
                            {mode === 'forgot_password' && (
                                <button
                                    onClick={() => setMode('signin')}
                                    className="absolute -top-6 -left-2 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            )}
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Sign Up'}
                                {mode === 'forgot_password' && 'Reset Password'}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {mode === 'signin' && 'Enter your details below'}
                                {mode === 'signup' && 'Create your free account'}
                                {mode === 'forgot_password' && 'Enter your email to receive a reset link'}
                            </p>
                        </div>


                        {/* Google Auth - Hidden in Forgot Password */}
                        {mode !== 'forgot_password' && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium text-sm py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex justify-center items-center gap-3 mb-6 active:scale-[0.98]"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-900 dark:text-white">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                                        <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="currentColor" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="currentColor" />
                                    </svg>
                                    <span className="text-xs font-semibold uppercase tracking-widest">Continue with Google</span>
                                </button>

                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                                        <span className="bg-white dark:bg-[#111] px-3 text-gray-400">or use email</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="olha@kovr.space"
                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {mode !== 'forgot_password' && (
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                            )}

                            <div className="flex items-center justify-between text-sm py-1">
                                {mode !== 'forgot_password' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                            className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                                        </button>
                                        {mode === 'signin' && (
                                            <button
                                                type="button"
                                                onClick={() => setMode('forgot_password')}
                                                className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setMode('signin')}
                                        className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                    >
                                        Back to Sign In
                                    </button>
                                )}
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
                                        <span>Processing...</span>
                                    </span>
                                ) : (
                                    <>
                                        <span>
                                            {mode === 'signin' && 'Sign In'}
                                            {mode === 'signup' && 'Sign Up'}
                                            {mode === 'forgot_password' && 'Send Reset Link'}
                                        </span>
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

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <div className="animate-spin h-8 w-8 border-4 border-black dark:border-white border-t-transparent rounded-full" />
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}

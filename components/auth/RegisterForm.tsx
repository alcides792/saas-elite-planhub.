'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
            }
        } catch (err) {
            setError('Error connecting to Google. Please try again.');
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const supabase = createClient();
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            if (data.user) {
                setSuccess('Account created! Redirecting...');
                setTimeout(() => {
                    router.push('/login');
                    router.refresh();
                }, 1500);
            }
        } catch (err) {
            setError('Error creating account. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm font-medium text-green-600">{success}</p>
                </div>
            )}

            {/* Google Login Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 mb-8 mt-2"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-zinc-500 font-bold tracking-widest">or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-bold mb-2">Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Minimum 6 characters"
                            className="w-full pl-12 pr-12 py-3.5 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-zinc-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-zinc-500 font-medium text-center">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-bold">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-700 font-bold">
                        Privacy Policy
                    </Link>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Creating account...</span>
                        </span>
                    ) : (
                        <>
                            <span>Create account</span>
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                                strokeWidth={2.5}
                            />
                        </>
                    )}
                </button>
            </form>
        </>
    );
}

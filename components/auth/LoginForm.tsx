'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            if (data.session) {
                router.push('/subscriptions');
                router.refresh();
            }
        } catch (err) {
            setError('Error signing in. Please try again.');
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

            <form onSubmit={handleLogin} className="space-y-5">
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
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-purple-600 border-zinc-300" />
                        <span className="font-medium text-zinc-600">Remember me</span>
                    </label>
                    <a href="#" className="font-bold text-purple-600 hover:text-purple-700 transition-colors">
                        Forgot password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
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
                            <span>Signing in...</span>
                        </span>
                    ) : (
                        <>
                            <span>Sign In</span>
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

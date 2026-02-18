'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    User,
    Save,
    Loader2,
    Key,
    Copy,
    RefreshCw,
    ShieldCheck,
    Globe,
    Coins,
    Check,
    Lock,
    Mail,
    Calendar,
    ArrowRight,
    Terminal,
    Settings2,
    Download,
    Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile } from '@/app/actions/settings';
import { useUser } from '@/contexts/UserContext';
import ConnectExtension from '@/components/ConnectExtension';
import { ThemeToggle } from '@/components/ThemeToggle';

// Custom UI Components
const BentoCard = ({ children, className = "", title, icon: Icon, description, badge }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 p-8 hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden rounded-3xl ${className}`}
    >
        {/* Subtle Gradient Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 blur-[80px] rounded-full group-hover:bg-purple-600/10 transition-colors duration-700" />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="p-3 bg-black/5 dark:bg-zinc-800/50 rounded-2xl border border-black/5 dark:border-white/5 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-all duration-500 shadow-inner">
                            <Icon size={22} />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                            {badge && (
                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-purple-500/20">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium leading-relaxed">{description}</p>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    </motion.div>
);

const CustomSwitch = ({ checked, onChange, label, description, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-zinc-800/20 border border-black/5 dark:border-white/5 rounded-2xl hover:bg-black/10 dark:hover:bg-zinc-800/40 transition-colors group">
        <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-gray-400 dark:text-zinc-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />}
            <div>
                <p className="text-sm font-bold text-gray-900 dark:text-zinc-200">{label}</p>
                {description && <p className="text-[11px] text-gray-500 dark:text-zinc-500">{description}</p>}
            </div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
        >
            <motion.div
                animate={{ x: checked ? 22 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
            />
        </button>
    </div>
);

const CustomInput = ({ label, value, onChange, placeholder, readOnly, type = "text", icon: Icon, prefix }: any) => (
    <div className="space-y-2">
        {label && <label className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] ml-2 block">{label}</label>}
        <div className={`relative group ${readOnly ? 'opacity-60' : ''}`}>
            {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-600 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors" />}
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`flex-1 w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${Icon ? 'pl-12' : ''}`}
            />
            {readOnly && <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-700" size={12} />}
        </div>
    </div>
);

export default function SettingsPage() {
    const { refreshPreferences } = useUser();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        currency: 'EUR',
        language: 'en-US'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const res = await getProfile();
        if (res.success && res.profile) {
            setProfile(res.profile);
            setFormData({
                full_name: res.profile.full_name || '',
                currency: res.profile.currency || 'EUR',
                language: res.profile.language || 'en-US'
            });
        }
        setIsLoading(false);
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateProfile(formData);
        if (res.success) {
            showToast('Settings saved!');
            setProfile({ ...profile, ...formData });
            await refreshPreferences();
        } else {
            showToast(res.error || 'Failed to save', 'error');
        }
        setIsSaving(false);
    };

    const copyKey = () => {
        if (profile?.extension_api_key) {
            navigator.clipboard.writeText(profile.extension_api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin" />
                    <Settings2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400/50" size={24} />
                </div>
                <p className="text-gray-500 dark:text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Control Panel...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12">

            {/* Page Title & Status */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-1 border border-purple-500 animate-pulse rounded-full" />
                        <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[11px]">Kovr Command Center</span>
                    </div>
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        Settings
                    </h1>
                </div>
                <ThemeToggle />
            </motion.div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="group relative flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-3xl font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                SAVE CHANGES
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* 1. Identity Profile Card (Left - 5 columns) */}
                <BentoCard
                    title="Digital Identity"
                    icon={User}
                    description="Personalize your network presence"
                    className="md:col-span-5"
                >
                    <div className="mt-4 space-y-8">
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-950/20 border border-gray-200 dark:border-white/5 rounded-[2.5rem] relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-zinc-950 flex items-center justify-center border-2 border-white/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl font-black text-purple-400/30">
                                        {formData.full_name?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <button className="mt-4 text-[10px] font-black text-gray-500 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 tracking-widest transition-colors">CHANGE PHOTO</button>
                        </div>

                        <div className="space-y-6">
                            <CustomInput
                                label="Full Name"
                                value={formData.full_name}
                                onChange={(e: any) => setFormData({ ...formData, full_name: e.target.value })}
                                icon={User}
                                placeholder="Your name"
                            />
                            <CustomInput
                                label="Email Address"
                                value={profile?.email}
                                readOnly={true}
                                icon={Mail}
                            />
                        </div>
                    </div>
                </BentoCard>

                {/* 2. Chrome Extension Section (Top Right - 7 columns) */}
                <BentoCard
                    title="Kovr Extension"
                    icon={Download}
                    description="Manage your subscriptions directly from the browser"
                    badge="Manual Installation"
                    className="md:col-span-7"
                >
                    <div className="mt-6 space-y-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-purple-500/20 rounded-[2.5rem] relative group overflow-hidden">
                            {/* Animated Circuit Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 animate-pulse" />

                            <div className="space-y-4 mb-8">
                                <p className="text-sm text-gray-600 dark:text-zinc-300 font-medium leading-relaxed">
                                    Download our extension to manage your subscriptions directly from the browser. Since we are not yet in the Chrome Store, you need to install it manually.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/extension.zip"
                                    download
                                    className="flex-1 flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-4 rounded-2xl font-black text-sm transition-all hover:bg-purple-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/20"
                                >
                                    <Download size={20} />
                                    DOWNLOAD EXTENSION (.ZIP)
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-6 py-4 rounded-2xl font-black text-sm transition-all hover:bg-gray-100 dark:hover:bg-zinc-700 hover:scale-[1.02] active:scale-95 shadow-sm"
                                >
                                    <Youtube size={20} className="text-red-500" />
                                    WATCH INSTALLATION TUTORIAL
                                </a>
                            </div>
                        </div>

                        {/* Extension Connection Section - Keeping ConnectExtension for the API Key display/checking */}
                        <div className="mt-2 border-t border-white/5 pt-8">
                            <ConnectExtension />
                        </div>
                    </div>
                </BentoCard>

                {/* 3. Preferences (Middle Row - 4 columns) */}
                <BentoCard
                    title="Global Settings"
                    icon={Globe}
                    description="Regional & Financial"
                    className="md:col-span-4"
                >
                    <div className="mt-4 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] ml-2 block">Main Currency</label>
                            <div className="relative">
                                <Coins size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-600" />
                                <select
                                    value={formData.currency}
                                    onChange={(e: any) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-5 py-3 appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold"
                                >
                                    <option value="USD">US Dollar ($) (Default)</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="BRL">Brazilian Real (R$)</option>
                                    <option value="AOA">Angolan Kwanza (AOA)</option>
                                    <option value="MZN">Mozambican Metical (MZN)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] ml-2 block">Base Language</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-600" />
                                <select
                                    value={formData.language}
                                    onChange={(e: any) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-5 py-3 appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold"
                                >
                                    <option value="en-US">English (USA) (Default)</option>
                                    <option value="pt-BR">Portuguese (Brazil)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </BentoCard>


            </div>

            {/* Toast Notification Container */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-8 py-4 rounded-[1.5rem] font-bold text-sm backdrop-blur-3xl border shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${toast.type === 'success'
                            ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 border-red-500/20 text-red-400'
                            }`}
                    >
                        <div className={`w-3 h-3 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`} />
                        {toast.message.toUpperCase()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Styles for specific theme overrides */}
            <style jsx global>{`
                ::selection {
                    background: rgba(139, 92, 246, 0.4);
                    color: white;
                }
                
                select option {
                    background-color: white;
                    color: black;
                }

                :global(.dark) select option {
                    background-color: #09090b;
                    color: #fff;
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s infinite;
                }
            `}</style>
        </div >
    );
}

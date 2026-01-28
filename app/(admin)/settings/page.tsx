'use client';

import { useState, useEffect } from 'react';
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
    Bell,
    Mail,
    Calendar,
    ArrowRight,
    Terminal,
    Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile, rotateApiKey } from '@/app/actions/settings';
import { useUser } from '@/contexts/UserContext';
import ConnectExtension from '@/components/ConnectExtension';

// Custom UI Components
const BentoCard = ({ children, className = "", title, icon: Icon, description, badge }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`plan-hub-card p-8 hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden ${className}`}
    >
        {/* Subtle Gradient Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 blur-[80px] rounded-full group-hover:bg-purple-600/10 transition-colors duration-700" />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500 shadow-inner">
                            <Icon size={22} />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                            {badge && (
                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-purple-500/20">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    </motion.div>
);

const CustomSwitch = ({ checked, onChange, label, description, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-4 bg-zinc-800/20 border border-white/5 rounded-2xl hover:bg-zinc-800/40 transition-colors group">
        <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />}
            <div>
                <p className="text-sm font-bold text-zinc-200">{label}</p>
                {description && <p className="text-[11px] text-zinc-500">{description}</p>}
            </div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-purple-600' : 'bg-zinc-700'}`}
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
        {label && <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2 block">{label}</label>}
        <div className={`relative group ${readOnly ? 'opacity-60' : ''}`}>
            {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />}
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`flex-1 plan-hub-input ${Icon ? 'pl-12' : ''}`}
            />
            {readOnly && <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />}
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
        language: 'en-US',
        notify_emails: true,
        notify_summary: true,
        notify_days_before: 3
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
                language: res.profile.language || 'en-US',
                notify_emails: res.profile.notify_emails,
                notify_summary: res.profile.notify_summary,
                notify_days_before: res.profile.notify_days_before
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

    const handleRotateKey = async () => {
        if (!confirm('Do you really want to generate a new key? The current connection will be closed.')) return;
        setIsRotating(true);
        const res = await rotateApiKey();
        if (res.success && res.apiKey) {
            showToast('Key updated!');
            setProfile({ ...profile, extension_api_key: res.apiKey });
        } else {
            showToast('Error updating key', 'error');
        }
        setIsRotating(false);
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
                <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Panel...</p>
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
                        <span className="text-purple-500 font-black uppercase tracking-[0.4em] text-[11px]">Plan Hub Command Center</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none">Settings <br /><span className="text-zinc-800">Panel</span></h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-3xl font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    SAVE CHANGES
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>

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
                        <div className="flex flex-col items-center justify-center p-8 bg-zinc-950/20 border border-white/5 rounded-[2.5rem] relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border-2 border-white/5 shadow-2xl relative overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black text-purple-400/30">
                                        {formData.full_name?.charAt(0).toUpperCase() || "E"}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <button className="mt-4 text-[10px] font-black text-zinc-500 hover:text-purple-400 tracking-widest transition-colors">CHANGE PHOTO</button>
                        </div>

                        <div className="space-y-6">
                            <CustomInput
                                label="Full Name"
                                value={formData.full_name}
                                onChange={(e: any) => setFormData({ ...formData, full_name: e.target.value })}
                                icon={User}
                                placeholder="Your elite name"
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

                {/* 2. Neural Terminal (Top Right - 7 columns) */}
                <BentoCard
                    title="Neural Center"
                    icon={Terminal}
                    description="External connection protocols"
                    badge="Certified"
                    className="md:col-span-7 bg-black/40 border-purple-500/10 shadow-[inner_0_0_80px_rgba(139,92,246,0.05)]"
                >
                    <div className="mt-6 space-y-8">
                        <div className="p-8 bg-zinc-950 border border-purple-500/20 rounded-[2.5rem] relative group overflow-hidden">
                            {/* Animated Circuit Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 animate-pulse" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                <div className="space-y-1 text-center md:text-left">
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">API Access Key</p>
                                    <h4 className="text-2xl font-black text-white font-mono break-all">
                                        {profile?.extension_api_key ? (
                                            <>
                                                ph_sk_<span className="opacity-10">••••••••••••••••</span>
                                            </>
                                        ) : "VOID_KEY"}
                                    </h4>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={copyKey}
                                        className="p-5 bg-white text-black rounded-[1.5rem] hover:bg-zinc-200 transition-all active:scale-90"
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                    <button
                                        onClick={handleRotateKey}
                                        disabled={isRotating}
                                        className="p-5 bg-zinc-800 border border-white/10 text-white rounded-[1.5rem] hover:bg-zinc-700 transition-all active:scale-90"
                                    >
                                        {isRotating ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                                <ShieldCheck className="text-purple-400 mt-1 shrink-0" size={16} />
                                <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider font-bold">
                                    This key must be kept in total secrecy. Any data leakage via API Key is the sole responsibility of the operator.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">Chrome Integration</p>
                                <p className="text-xs text-zinc-400">Plan Hub v1.0</p>
                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black tracking-widest mt-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    ENCRYPTED CONNECTION
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">Last Rotation</p>
                                <p className="text-xs text-zinc-400">Today at 18:45</p>
                                <p className="text-[10px] text-zinc-500 font-bold mt-3">Protocol SHA-256 Enabled</p>
                            </div>
                        </div>

                        {/* Extension Connection Section */}
                        <div className="mt-8 border-t border-white/5 pt-8">
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
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2 block">Main Currency</label>
                            <div className="relative">
                                <Coins size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <select
                                    value={formData.currency}
                                    onChange={(e: any) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full plan-hub-input pl-11 pr-5 appearance-none"
                                >
                                    <option value="EUR">Euro (€)</option>
                                    <option value="USD">Dollar ($)</option>
                                    <option value="BRL">Brazilian Real (R$)</option>
                                    <option value="AOA">Angolan Kwanza (AOA)</option>
                                    <option value="MZN">Mozambican Metical (MZN)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2 block">Base Language</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                <select
                                    value={formData.language}
                                    onChange={(e: any) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full plan-hub-input pl-11 pr-5 appearance-none"
                                >
                                    <option value="en-US">English (USA) (Default)</option>
                                    <option value="pt-BR">Portuguese (Brazil)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* 4. Notification Center (Bottom Row - 8 columns) */}
                <BentoCard
                    title="Notification Center"
                    icon={Bell}
                    description="Alert control and smart reports"
                    className="md:col-span-8"
                >
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <CustomSwitch
                                checked={formData.notify_emails}
                                onChange={(val: boolean) => setFormData({ ...formData, notify_emails: val })}
                                label="Renewal Alerts"
                                description="Receive email about upcoming renewals"
                                icon={Mail}
                            />
                            <CustomSwitch
                                checked={formData.notify_summary}
                                onChange={(val: boolean) => setFormData({ ...formData, notify_summary: val })}
                                label="Weekly Summary"
                                description="Consolidated spending report"
                                icon={Calendar}
                            />
                        </div>

                        <div className="p-6 bg-zinc-800/20 border border-white/5 rounded-[2rem] space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                                    <Calendar size={18} />
                                </div>
                                <h5 className="text-sm font-black text-white uppercase tracking-widest">Alert Lead Time</h5>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[1, 3, 7].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setFormData({ ...formData, notify_days_before: days })}
                                        className={`py-3 rounded-2xl font-black text-xs transition-all border ${formData.notify_days_before === days
                                            ? 'bg-white text-black border-white'
                                            : 'bg-zinc-950 text-zinc-500 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {days} {days === 1 ? 'DAY' : days === 7 ? 'WEEK' : 'DAYS'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-zinc-600 font-bold leading-relaxed px-2">
                                * Plan Hub AI will trigger alerts according to the selected lead time to avoid unplanned charges.
                            </p>
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
                
                body {
                    background-color: #030303;
                    color: #fff;
                }

                select option {
                    background-color: #09090b;
                    color: #fff;
                    padding: 20px;
                }

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

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { cn as classNames } from '@/lib/utils';
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
    Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile } from '@/app/actions/settings';
import { useUser } from '@/contexts/UserContext';
import PremiumSelect from '@/components/ui/PremiumSelect';
import UserMenu from '@/components/UserMenu';
import { createClient } from '@/lib/utils/supabase/client';
const AVATARS = [
    '/avatars/avatar.png',
    '/avatars/avatar-de-perfil.png',
    '/avatars/menina.png',
    '/avatars/menina (1).png',
    '/avatars/menina (2).png',
    '/avatars/garoto.png',
    '/avatars/garoto (1).png',
    '/avatars/163814.png',
    '/avatars/921027.png',
    '/avatars/1466118.png',
    '/avatars/3554891.png',
    '/avatars/4134138.png',
    '/avatars/4134198.png',
    '/avatars/4202840.png',
    '/avatars/9541360.png',
];

// Custom UI Components
const BentoCard = ({ children, className = "", title, icon: Icon, description, badge }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 transition-all duration-300 group relative rounded-3xl ${className}`}
    >
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                            <Icon size={20} />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                            {badge && (
                                <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-zinc-200 dark:border-zinc-700">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">{description}</p>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    </motion.div>
);

const CustomSwitch = ({ checked, onChange, label, description, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 rounded-2xl transition-colors group">
        <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-gray-400 dark:text-zinc-600 transition-colors" />}
            <div>
                <p className="text-sm font-bold text-gray-900 dark:text-zinc-200">{label}</p>
                {description && <p className="text-[11px] text-gray-500 dark:text-zinc-500">{description}</p>}
            </div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-zinc-800'}`}
        >
            <motion.div
                animate={{ x: checked ? 22 : 4 }}
                className={`absolute top-1 w-3 h-3 rounded-full shadow-sm ${checked ? 'bg-white dark:bg-black' : 'bg-white dark:bg-zinc-400'}`}
            />
        </button>
    </div>
);

const CustomInput = ({ label, value, onChange, placeholder, readOnly, type = "text", icon: Icon }: any) => (
    <div className="space-y-2">
        {label && <label className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest ml-1 block">{label}</label>}
        <div className={`relative group ${readOnly ? 'opacity-50' : ''}`}>
            {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-600 transition-colors" />}
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`flex-1 w-full bg-zinc-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-700 focus:outline-none focus:border-black dark:focus:border-white transition-all text-sm ${Icon ? 'pl-11' : ''}`}
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

    const handleAvatarSelect = async (avatarUrl: string) => {
        if (!profile?.id) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', profile.id);

        if (error) {
            showToast('Failed to update avatar', 'error');
        } else {
            setProfile({ ...profile, avatar_url: avatarUrl });
            showToast('Avatar updated!');
            await refreshPreferences();
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
        <div className="max-w-5xl mx-auto px-6 py-20">

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
            >
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your account preferences and regional settings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <UserMenu />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-lg shadow-black/5"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="space-y-8">

                {/* Section 1: Identity & Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Identity Profile Card */}
                    <BentoCard
                        title="Profile"
                        icon={User}
                        description="Your personal information"
                    >
                        <div className="mt-6 space-y-8">
                            <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-white/5 rounded-3xl">
                                <div className="w-20 h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-white/10 relative overflow-hidden shrink-0">
                                    {profile?.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt="Profile"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">
                                            {formData.full_name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <button className="text-[10px] font-black text-zinc-500 hover:text-black dark:hover:text-white tracking-widest transition-colors uppercase">Change Avatar</button>
                                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tight">JPG or PNG. Max 2MB.</p>
                                </div>
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

                    {/* Preferences Card */}
                    <BentoCard
                        title="Localization"
                        icon={Globe}
                        description="Region and financial preferences"
                    >
                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest ml-1 block">Main Currency</label>
                                <PremiumSelect
                                    value={formData.currency}
                                    onChange={(val) => setFormData({ ...formData, currency: val })}
                                    options={[
                                        { value: 'USD', label: 'US Dollar ($) (Default)' },
                                        { value: 'EUR', label: 'Euro (€)' },
                                        { value: 'BRL', label: 'Brazilian Real (R$)' },
                                        { value: 'AOA', label: 'Angolan Kwanza (AOA)' },
                                        { value: 'MZN', label: 'Mozambican Metical (MZN)' },
                                    ]}
                                    icon={Coins}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest ml-1 block">Base Language</label>
                                <PremiumSelect
                                    value={formData.language}
                                    onChange={(val) => setFormData({ ...formData, language: val })}
                                    options={[
                                        { value: 'en-US', label: 'English (USA) (Default)' },
                                        { value: 'pt-BR', label: 'Portuguese (Brazil)' },
                                    ]}
                                    icon={Globe}
                                />
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Section 2: Avatar Selection */}
                <BentoCard
                    title="Escolhe o teu Avatar"
                    icon={User}
                    description="Select a character that represents you"
                >
                    <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                        {AVATARS.map((avatar) => {
                            const isSelected = profile?.avatar_url === avatar;
                            return (
                                <button
                                    key={avatar}
                                    onClick={() => handleAvatarSelect(avatar)}
                                    className={classNames(
                                        "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 group bg-zinc-50 dark:bg-zinc-900/50 border-4",
                                        isSelected
                                            ? "border-black dark:border-[#1fe2c3] shadow-[4px_4px_0px_#1fe2c3] scale-105 z-10"
                                            : "border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                                    )}
                                >
                                    <Image
                                        src={avatar}
                                        alt="Avatar option"
                                        fill
                                        className={classNames(
                                            "object-contain p-2 transition-transform duration-300",
                                            isSelected ? "scale-110" : "group-hover:scale-110"
                                        )}
                                    />
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-[#1fe2c3] border border-black p-0.5 rounded-full z-20">
                                            <Check size={10} className="text-black" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </BentoCard>
            </div>

            {/* Toast Notification Container */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-xs backdrop-blur-xl border shadow-2xl ${toast.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {toast.message.toUpperCase()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

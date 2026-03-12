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
import { AVATARS } from '@/lib/constants';
import { toast } from 'sonner';

// Custom UI Components
// Custom UI Components
const BentoCard = ({ children, className = "", title, icon: Icon, description, badge }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-8 transition-all duration-300 group relative rounded-lg ${className}`}
    >
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                            <Icon size={18} />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight uppercase">{title}</h3>
                            {badge && (
                                <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-medium uppercase tracking-wider rounded-md border border-gray-100 dark:border-white/10">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {description && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    </motion.div>
);

const CustomSwitch = ({ checked, onChange, label, description, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
            {Icon && <Icon size={16} className="text-gray-400 transition-colors" />}
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                {description && <p className="text-[10px] text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-9 h-5 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-white/10'}`}
        >
            <motion.div
                animate={{ x: checked ? 18 : 4 }}
                className={`absolute top-1 w-3 h-3 rounded-full shadow-sm ${checked ? 'bg-white dark:bg-black' : 'bg-white dark:bg-gray-400'}`}
            />
        </button>
    </div>
);

const CustomInput = ({ label, value, onChange, placeholder, readOnly, type = "text", icon: Icon }: any) => (
    <div className="space-y-2">
        {label && <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1 block">{label}</label>}
        <div className={`relative group ${readOnly ? 'opacity-60' : ''}`}>
            {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" />}
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`flex-1 w-full bg-transparent border border-gray-200 dark:border-[#333] rounded-md px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all text-sm ${Icon ? 'pl-9' : ''}`}
            />
            {readOnly && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={10} />}
        </div>
    </div>
);

export default function SettingsPage() {
    const { refreshPreferences } = useUser();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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


    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateProfile(formData);
        if (res.success) {
            toast.success('Settings saved!');
            setProfile({ ...profile, ...formData });
            await refreshPreferences();
        } else {
            toast.error(res.error || 'Failed to save');
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
            toast.error('Failed to update avatar');
        } else {
            setProfile({ ...profile, avatar_url: avatarUrl });
            toast.success('Avatar updated!');
            await refreshPreferences();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="relative">
                    <div className="w-10 h-10 border-2 border-gray-200 dark:border-white/10 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
                </div>
                <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px]">Accessing Control Panel...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and regional settings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <UserMenu />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
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
                            <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg">
                                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center border border-gray-100 dark:border-white/10 relative overflow-hidden shrink-0">
                                    {profile?.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt="Profile"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-gray-400">
                                            {formData.full_name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <button className="text-[10px] font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white tracking-widest transition-colors uppercase">Change Avatar</button>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">JPG or PNG. Max 2MB.</p>
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
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1 block">Main Currency</label>
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
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1 block">Base Language</label>
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
                    title="Choose your Avatar"
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
                                        "relative aspect-square rounded-lg overflow-hidden transition-all duration-300 group bg-gray-50 dark:bg-white/5 border",
                                        isSelected
                                            ? "border-gray-900 dark:border-white scale-105 z-10 shadow-md"
                                            : "border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30"
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
                                        <div className="absolute top-1 right-1 bg-gray-900 dark:bg-white p-0.5 rounded-full z-20">
                                            <Check size={8} className="text-white dark:text-black" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </BentoCard>
            </div>

        </div>
    );
}

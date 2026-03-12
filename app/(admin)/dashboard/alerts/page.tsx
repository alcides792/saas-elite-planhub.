'use client'

import * as React from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import Image from 'next/image'
import TelegramConnect from '@/components/settings/TelegramConnect'
import ComingSoonCard from '@/components/settings/ComingSoonCard'
import ReportActions from '@/components/alerts/ReportActions'
import ExportModal from '@/components/ExportModal'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Loader2, Bell, Clock, Save, CheckCircle2, AlertCircle
} from 'lucide-react'
import { saveAlertSettings, getProfile } from '@/app/actions/settings'
import { disconnectDiscord } from '@/app/actions/notifications'
import { toast } from "sonner"
import UserMenu from '@/components/UserMenu'

export default function AlertsPage() {
    const [profile, setProfile] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [exportModal, setExportModal] = React.useState<{ open: boolean, type: 'PDF' | 'CSV' | null }>({ open: false, type: null })
    const [isExporting, setIsExporting] = React.useState(false)
    const [isDisconnectingDiscord, setIsDisconnectingDiscord] = React.useState(false)

    // Discord OAuth2 URL
    const [discordAuthUrl, setDiscordAuthUrl] = React.useState<string>('')

    React.useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || '')
        const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/discord/callback`)
        setDiscordAuthUrl(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=webhook.incoming`)
    }, [])

    const searchParams = useSearchParams()
    const router = useRouter()

    React.useEffect(() => {
        async function loadProfile() {
            const res = await getProfile()
            if (res.success) {
                setProfile(res.profile)
            }
            setIsLoading(false)
        }
        loadProfile()
    }, [])

    // Handle Discord OAuth redirect feedback
    React.useEffect(() => {
        const success = searchParams.get('success')
        const error = searchParams.get('error')

        if (success === 'discord_connected') {
            toast.success('Discord connected successfully!')
            router.replace('/dashboard/alerts', { scroll: false })
        } else if (error) {
            const messages: Record<string, string> = {
                no_code: 'Discord authorization failed: no code received.',
                token_exchange_failed: 'Failed to connect Discord. Please try again.',
                save_failed: 'Connected to Discord but failed to save. Please try again.',
                unexpected: 'An unexpected error occurred. Please try again.',
            }
            toast.error(messages[error] || 'Discord connection failed.')
            router.replace('/dashboard/alerts', { scroll: false })
        }
    }, [searchParams, router])

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setIsSaving(true)
        try {
            const res = await saveAlertSettings(formData)
            if (res.success) {
                toast.success("Settings saved successfully!")
            } else {
                toast.error(res.error || "Error saving settings")
            }
        } catch (error) {
            toast.error("Unexpected error saving")
        } finally {
            setIsSaving(false)
        }
    }

    const handleExportClick = (type: 'PDF' | 'CSV') => {
        setExportModal({ open: true, type })
    }

    const handleDisconnectDiscord = async () => {
        setIsDisconnectingDiscord(true)
        try {
            const res = await disconnectDiscord()
            if (res.success) {
                setProfile((prev: any) => ({ ...prev, discord_webhook: null }))
                toast.success('Discord disconnected successfully!')
            } else {
                toast.error(res.error || 'Error disconnecting Discord')
            }
        } catch {
            toast.error('Unexpected error disconnecting Discord')
        } finally {
            setIsDisconnectingDiscord(false)
        }
    }

    const handleExport = async (channel: 'email' | 'telegram') => {
        if (!exportModal.type) return

        setIsExporting(true)
        try {
            const res = await fetch('/api/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    format: exportModal.type.toLowerCase(),
                    channel
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success(`Report sent to your ${channel === 'telegram' ? 'Telegram' : 'Email'}!`)
                setExportModal({ open: false, type: null })
            } else {
                toast.error(data.error || 'Error sending report')
            }
        } catch (error) {
            toast.error('Unexpected error processing export')
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    const inactiveCardStyle = "bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl p-6 shadow-sm dark:shadow-none transition-all duration-300 flex flex-col justify-between"
    const activeCardStyle = "bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl p-6 shadow-sm dark:shadow-none transition-all duration-300 flex flex-col justify-between"

    return (
        <div className="max-w-5xl mx-auto w-full space-y-10 py-10 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight uppercase">
                        Alert Center
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Configure when and where you want to receive your alerts.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Channels */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available Channels</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Telegram Card */}
                        <TelegramConnect />

                        {/* Discord Card */}
                        <div className={profile?.discord_webhook ? activeCardStyle : inactiveCardStyle}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-white/5 rounded-lg flex items-center justify-center relative shrink-0">
                                        <Image src="/icons/discord-3d.png" alt="Discord" fill className="object-contain p-2" />
                                    </div>
                                    {profile?.discord_webhook ? (
                                        <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                                            ACTIVE
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                                            AVAILABLE
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">Discord</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Webhook for servers.</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                {profile?.discord_webhook ? (
                                    <button
                                        onClick={handleDisconnectDiscord}
                                        disabled={isDisconnectingDiscord}
                                        className="w-full py-2 bg-transparent border border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-white/5 font-medium rounded-md text-center text-xs text-gray-600 dark:text-gray-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isDisconnectingDiscord ? (
                                            <><Loader2 size={14} className="animate-spin" /> Disconnecting...</>
                                        ) : 'Disconnect'}
                                    </button>
                                ) : (
                                    <a
                                        href={discordAuthUrl}
                                        className="block w-full py-2 bg-gray-900 text-white dark:bg-white dark:text-black font-medium rounded-md text-center text-sm hover:opacity-90 transition-opacity"
                                    >
                                        Connect Discord
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Default Email Card */}
                        <div className={activeCardStyle}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-white/5 rounded-lg flex items-center justify-center relative shrink-0">
                                        <Image src="/icons/gmail-3d.png" alt="Email" fill className="object-contain p-2" />
                                    </div>
                                    <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                                        ACTIVE
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">Email</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{profile?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Card */}
                        <div className={inactiveCardStyle}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-white/5 rounded-lg flex items-center justify-center relative shrink-0">
                                        <Image src="/icons/whatsapp-3d.png" alt="WhatsApp" fill className="object-contain p-2" />
                                    </div>
                                    <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                                        SOON
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">WhatsApp</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Directly on your WhatsApp.</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    disabled
                                    className="w-full py-3 bg-transparent border-0 font-medium rounded-xl text-center text-sm text-gray-400 cursor-not-allowed"
                                >
                                    Unavailable
                                </button>
                            </div>
                        </div>
                        {/* Native Push Card */}
                        <div className={inactiveCardStyle}>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center relative shrink-0">
                                        <Image src="/icons/kovr-3d.png" alt="Kovr App" fill className="object-contain p-2" />
                                    </div>
                                    <div className="bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-[10px] font-bold">
                                        SOON
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">Native Push</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">iOS and Android app.</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    disabled
                                    className="w-full py-3 bg-transparent border-0 font-medium rounded-xl text-center text-sm text-slate-600 cursor-not-allowed"
                                >
                                    Indisponível
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Smart Reports (Experimental)</h2>
                        </div>
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl p-6 shadow-sm dark:shadow-none">
                            <ReportActions onExportClick={handleExportClick} />
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Settings */}
                <aside className="lg:col-span-4 lg:mt-[2.2rem]">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl p-6 space-y-8 sticky top-6 shadow-sm dark:shadow-none">

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">
                                Preferences
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-900 dark:text-white">Payment Reminders</Label>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-500">Notify before expiration.</p>
                                    </div>
                                    <Switch name="notify_expiration" defaultChecked={profile?.notify_expiration ?? true} className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-900 dark:text-white">Weekly Summary</Label>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-500">Total weekly spending.</p>
                                    </div>
                                    <Switch name="notify_weekly_summary" defaultChecked={profile?.notify_weekly_summary ?? true} className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-900 dark:text-white">Price Alerts</Label>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-500">Alerts about price changes.</p>
                                    </div>
                                    <Switch name="notify_price_change" defaultChecked={profile?.notify_price_change ?? true} className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-[#333] w-full" />

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">
                                Notification Timing
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Days in Advance</Label>
                                    <Select name="notify_days_before" defaultValue={String(profile?.notify_days_before ?? "3")}>
                                        <SelectTrigger className="w-full bg-transparent border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-md h-10 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] text-gray-900 dark:text-white">
                                            <SelectItem value="1">1 day</SelectItem>
                                            <SelectItem value="3">3 days</SelectItem>
                                            <SelectItem value="5">5 days</SelectItem>
                                            <SelectItem value="7">1 week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Delivery Time</Label>
                                    <Select name="notify_time" defaultValue={profile?.notify_time ?? "09"}>
                                        <SelectTrigger className="w-full bg-transparent border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-md h-10 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] text-gray-900 dark:text-white">
                                            <SelectItem value="08">08:00 AM</SelectItem>
                                            <SelectItem value="09">09:00 AM</SelectItem>
                                            <SelectItem value="10">10:00 AM</SelectItem>
                                            <SelectItem value="12">Noon</SelectItem>
                                            <SelectItem value="18">06:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ opacity: 0.9 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Preferences
                        </motion.button>

                        <div className="flex gap-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-md text-[11px] text-gray-500 dark:text-gray-400 items-start">
                            <AlertCircle size={14} className="shrink-0 mt-0.5 text-gray-400" />
                            <p>Alert settings are global. You will receive notifications on all active channels above.</p>
                        </div>
                    </form>
                </aside>
            </div>

            <ExportModal
                isOpen={exportModal.open}
                onClose={() => setExportModal({ open: false, type: null })}
                onSelect={handleExport}
                type={exportModal.type}
                isLoading={isExporting}
            />
        </div>
    );
}

'use client'

import * as React from "react"
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
    Gamepad2, Smartphone, ShieldAlert, Save, Loader2,
    Bell, Mail, MessageSquare, Clock, CalendarClock,
    TrendingUp, CheckCircle2, AlertCircle
} from 'lucide-react'
import { saveAlertSettings, getProfile } from '@/app/actions/settings'
import { toast } from "sonner"
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AlertsPage() {
    const [profile, setProfile] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [exportModal, setExportModal] = React.useState<{ open: boolean, type: 'PDF' | 'CSV' | null }>({ open: false, type: null })
    const [isExporting, setIsExporting] = React.useState(false)

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
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    const cardStyle = "bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 shadow-xl dark:shadow-2xl"

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-gray-900 dark:text-white tracking-tight"
                    >
                        Alert <span className="text-purple-600 dark:text-purple-500">Center</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 dark:text-zinc-400 text-lg mt-2"
                    >
                        Configure how and when you want to be notified about your finances.
                    </motion.p>
                </div>
                <ThemeToggle />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Channels (Bento Box 1) */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-purple-500 rounded-full" />
                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Available Channels</h2>
                    </div>

                    {/* Telegram Card - Main Focus */}
                    <div className={cardStyle}>
                        <TelegramConnect />
                    </div>

                    {/* Secondary Grid for Email/WhatsApp */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* WhatsApp Status Card */}
                        <div className={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 relative shrink-0">
                                    <Image src="/icons/whatsapp-3d.png" alt="WhatsApp" fill className="object-contain" />
                                </div>
                                <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Coming Soon</div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">WhatsApp</h3>
                            <p className="text-gray-500 dark:text-zinc-500 text-sm">Direct alerts via chat.</p>
                        </div>

                        {/* Email Status Card */}
                        <div className={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 relative shrink-0">
                                    <Image src="/icons/gmail-3d.png" alt="Gmail" fill className="object-contain" />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                    <CheckCircle2 size={12} /> Active
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                            <p className="text-gray-500 dark:text-zinc-500 text-sm">Sent to {profile?.email || 'your email'}.</p>
                        </div>
                    </div>

                    {/* Discord & App (Coming Soon) */}
                    <div className="grid md:grid-cols-2 gap-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                        <ComingSoonCard
                            image="/icons/discord-3d.png"
                            title="Discord"
                            description="Webhook integration."
                        />
                        <ComingSoonCard
                            image="/icons/kovr-3d.png"
                            title="Native Push"
                            description="Kovr App for iOS/Android."
                        />
                    </div>

                    {/* Export Actions Box */}
                    <div className={cardStyle}>
                        <h2 className="text-sm font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-6">Smart Reports</h2>
                        <ReportActions onExportClick={handleExportClick} />
                    </div>
                </div>

                {/* RIGHT COLUMN: Settings (Bento Box 2) */}
                <aside className="lg:col-span-5 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-purple-500 rounded-full" />
                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Configurações</h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Preferences Card */}
                        <div className={cardStyle}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Bell size={20} className="text-purple-600 dark:text-purple-500" />
                                Preferências
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-gray-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">Lembretes de Contas</Label>
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 italic">Notificar antes da data de vencimento.</p>
                                    </div>
                                    <Switch name="notify_expiration" defaultChecked={profile?.notify_expiration ?? true} />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-gray-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">Resumo Semanal</Label>
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 italic">Total de gastos da semana.</p>
                                    </div>
                                    <Switch name="notify_weekly_summary" defaultChecked={profile?.notify_weekly_summary ?? true} />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-gray-700 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">Alertas de Valor</Label>
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 italic">Preços que aumentaram.</p>
                                    </div>
                                    <Switch name="notify_price_change" defaultChecked={profile?.notify_price_change ?? true} />
                                </div>
                            </div>
                        </div>

                        {/* Timing Card */}
                        <div className={cardStyle}>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Clock size={20} className="text-purple-600 dark:text-purple-500" />
                                Horário e Prazo
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Dias de Antecedência</Label>
                                    <Select name="notify_days_before" defaultValue={String(profile?.notify_days_before ?? "3")}>
                                        <SelectTrigger className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl h-12">
                                            <SelectValue placeholder="Selecionar" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                            <SelectItem value="1">1 dia antes</SelectItem>
                                            <SelectItem value="3">3 dias antes (Vantagem)</SelectItem>
                                            <SelectItem value="5">5 dias antes</SelectItem>
                                            <SelectItem value="7">1 semana antes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Horário de Entrega</Label>
                                    <Select name="notify_time" defaultValue={profile?.notify_time ?? "09"}>
                                        <SelectTrigger className="w-full bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl h-12">
                                            <SelectValue placeholder="Selecionar" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                            <SelectItem value="08">08:00 AM</SelectItem>
                                            <SelectItem value="09">09:00 AM</SelectItem>
                                            <SelectItem value="10">10:00 AM</SelectItem>
                                            <SelectItem value="12">Meio-dia</SelectItem>
                                            <SelectItem value="18">06:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-xl hover:bg-black dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            SALVAR CONFIGURAÇÕES
                        </motion.button>

                        {/* Info Tip */}
                        <div className="flex gap-3 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-[12px] text-purple-200 items-start">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>As configurações de alerta são globais. Você receberá notificações em todos os canais ativos acima.</p>
                        </div>
                    </form>
                </aside>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={exportModal.open}
                onClose={() => setExportModal({ open: false, type: null })}
                onSelect={handleExport}
                type={exportModal.type}
                isLoading={isExporting}
            />
        </div >
    )
}

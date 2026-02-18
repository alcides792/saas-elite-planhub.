'use client'
import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, CalendarClock, TrendingUp, Mail } from "lucide-react"

interface NotificationPreferencesProps {
    initialData?: {
        notify_expiration?: boolean;
        notify_weekly_summary?: boolean;
        notify_price_change?: boolean;
    }
}

export default function NotificationPreferences({ initialData }: NotificationPreferencesProps) {
    return (
        <div className="bg-[#0F0F11] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell size={18} className="text-zinc-400" />
                Delivery Preferences
            </h3>
            <div className="space-y-6">

                {/* 1. Alerta de Vencimento (O NOVO) */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200 flex items-center gap-2">
                            <CalendarClock size={16} className="text-purple-500" />
                            Expiration Reminders
                        </Label>
                        <p className="text-xs text-zinc-500">Notify me before a bill is due.</p>
                    </div>
                    <Switch name="notify_expiration" defaultChecked={initialData?.notify_expiration ?? true} />
                </div>

                {/* 2. Resumo Semanal */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200 flex items-center gap-2">
                            <Mail size={16} className="text-blue-500" />
                            Weekly Summary
                        </Label>
                        <p className="text-xs text-zinc-500">Receive an email with the total spent this week.</p>
                    </div>
                    <Switch name="notify_weekly_summary" defaultChecked={initialData?.notify_weekly_summary ?? true} />
                </div>

                {/* 3. Alertas Críticos */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200 flex items-center gap-2">
                            <TrendingUp size={16} className="text-red-500" />
                            Price Alerts
                        </Label>
                        <p className="text-xs text-zinc-500">Notify me if a subscription becomes more expensive.</p>
                    </div>
                    <Switch name="notify_price_change" defaultChecked={initialData?.notify_price_change ?? true} />
                </div>

            </div>
        </div>
    )
}

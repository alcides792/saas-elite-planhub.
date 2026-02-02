'use client'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail, Bell } from "lucide-react"

export default function NotificationPreferences() {
    return (
        <div className="bg-[#0F0F11] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell size={18} className="text-zinc-400" />
                Preferências de Envio
            </h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200">Resumo Semanal</Label>
                        <p className="text-xs text-zinc-500">Receba um e-mail toda segunda-feira.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200">Alertas Críticos</Label>
                        <p className="text-xs text-zinc-500">Avise-me quando uma assinatura subir de preço.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>
        </div>
    )
}

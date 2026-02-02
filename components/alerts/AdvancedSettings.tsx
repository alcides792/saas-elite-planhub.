'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdvancedSettings() {
    return (
        <div className="bg-[#0F0F11] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Configuração Avançada</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Antecedência do Alerta</label>
                    <Select defaultValue="3">
                        <SelectTrigger className="w-full bg-zinc-900 border-white/10 text-white">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 dia antes</SelectItem>
                            <SelectItem value="3">3 dias antes (Recomendado)</SelectItem>
                            <SelectItem value="7">7 dias antes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Horário de Envio</label>
                    <Select defaultValue="09">
                        <SelectTrigger className="w-full bg-zinc-900 border-white/10 text-white">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="08">08:00 AM</SelectItem>
                            <SelectItem value="09">09:00 AM</SelectItem>
                            <SelectItem value="12">12:00 PM</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

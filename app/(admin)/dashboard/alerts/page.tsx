import TelegramConnect from '@/components/settings/TelegramConnect'
import ComingSoonCard from '@/components/settings/ComingSoonCard'
import ReportActions from '@/components/alerts/ReportActions'
import NotificationPreferences from '@/components/alerts/NotificationPreferences'
import AdvancedSettings from '@/components/alerts/AdvancedSettings'
import { Gamepad2, Smartphone, ShieldAlert } from 'lucide-react'

export default function AlertsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6 md:p-10">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Central de Alertas</h1>
                <p className="text-zinc-400">Gerencie seus canais, regras de envio e relatórios.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* COLUNA ESQUERDA (CANAIS) - Ocupa 7 colunas */}
                <div className="lg:col-span-7 space-y-6">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Canais de Envio</h2>

                    {/* O Telegram é o destaque principal */}
                    <TelegramConnect />

                    <div className="grid md:grid-cols-2 gap-4">
                        <ComingSoonCard
                            icon={Gamepad2}
                            title="Discord"
                            description="Alertas no servidor."
                            color="#5865F2"
                        />
                        <ComingSoonCard
                            icon={Smartphone}
                            title="App Mobile"
                            description="Push Nativo."
                            color="#10b981"
                        />
                    </div>

                    {/* Relatórios Rápidos (Agora aqui embaixo dos canais) */}
                    <div className="pt-6">
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Exportar Dados</h2>
                        <ReportActions />
                    </div>
                </div>

                {/* COLUNA DIREITA (CONFIGURAÇÕES) - Ocupa 5 colunas */}
                <div className="lg:col-span-5 space-y-6">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Configuração</h2>

                    {/* As seções movidas */}
                    <NotificationPreferences />
                    <AdvancedSettings />

                    {/* Card Informativo Extra */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-sm text-blue-200">
                        <ShieldAlert className="shrink-0" />
                        <p>O Kovr monitora suas assinaturas 24/7. Alterações aqui entram em vigor imediatamente.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

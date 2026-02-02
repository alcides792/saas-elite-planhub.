'use client'

import * as React from "react"
import { FileText, Download, Table, Loader2 } from "lucide-react"
import { sendExportToTelegram } from "@/app/actions/reports"
import { toast } from "sonner"

export default function ReportActions() {
    const [isExporting, setIsExporting] = React.useState<string | null>(null)

    const handleExport = async (type: 'csv' | 'pdf') => {
        setIsExporting(type)
        try {
            const res = await sendExportToTelegram(type)
            if (res.success) {
                toast.success(`Relatório ${type.toUpperCase()} enviado para o seu Telegram!`)
            } else {
                toast.error(res.error || `Erro ao enviar relatório ${type.toUpperCase()}`)
            }
        } catch (error) {
            toast.error("Erro inesperado ao processar exportação")
        } finally {
            setIsExporting(null)
        }
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => handleExport('pdf')}
                disabled={!!isExporting}
                className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group disabled:opacity-50"
            >
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                    {isExporting === 'pdf' ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Relatório PDF</p>
                    <p className="text-[10px] text-zinc-500">Visão geral mensal</p>
                </div>
                {!isExporting && <Download size={14} className="ml-auto text-zinc-600" />}
            </button>

            <button
                onClick={() => handleExport('csv')}
                disabled={!!isExporting}
                className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group disabled:opacity-50"
            >
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                    {isExporting === 'csv' ? <Loader2 size={20} className="animate-spin" /> : <Table size={20} />}
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Planilha CSV</p>
                    <p className="text-[10px] text-zinc-500">Dados brutos</p>
                </div>
                {!isExporting && <Download size={14} className="ml-auto text-zinc-600" />}
            </button>
        </div>
    )
}

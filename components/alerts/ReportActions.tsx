'use client'

import { FileText, Download, Table } from "lucide-react"

export default function ReportActions() {
    const handleExport = (type: string) => {
        console.log(`Exporting ${type}...`)
        // Mock export logic
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group"
            >
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Relatório PDF</p>
                    <p className="text-[10px] text-zinc-500">Visão geral mensal</p>
                </div>
                <Download size={14} className="ml-auto text-zinc-600" />
            </button>

            <button
                onClick={() => handleExport('CSV')}
                className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group"
            >
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                    <Table size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Planilha CSV</p>
                    <p className="text-[10px] text-zinc-500">Dados brutos</p>
                </div>
                <Download size={14} className="ml-auto text-zinc-600" />
            </button>
        </div>
    )
}

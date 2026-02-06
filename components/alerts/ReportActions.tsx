'use client'

import * as React from "react"
import Image from "next/image"
import { Download } from "lucide-react"

interface ReportActionsProps {
    onExportClick: (type: 'PDF' | 'CSV') => void
}

export default function ReportActions({ onExportClick }: ReportActionsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => onExportClick('PDF')}
                className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group h-full"
            >
                <div className="w-16 h-16 relative shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Image src="/icons/pdf-3d.png" alt="PDF" fill className="object-contain" />
                </div>
                <div className="text-center sm:text-left flex-1">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Relatório PDF</p>
                    <p className="text-[10px] text-zinc-500 mb-2">Visão geral mensal</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400">
                        <Download size={12} /> EXPORTAR
                    </div>
                </div>
            </button>

            <button
                onClick={() => onExportClick('CSV')}
                className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group h-full"
            >
                <div className="w-16 h-16 relative shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Image src="/icons/csv-3d.png" alt="CSV" fill className="object-contain" />
                </div>
                <div className="text-center sm:text-left flex-1">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Planilha CSV</p>
                    <p className="text-[10px] text-zinc-500 mb-2">Dados brutos (.csv)</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <Download size={12} /> EXPORTAR
                    </div>
                </div>
            </button>
        </div>
    )
}

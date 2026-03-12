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
                className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group h-full text-left"
            >
                <div className="w-16 h-16 relative shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image src="/icons/pdf-3d.png" alt="PDF" fill className="object-contain" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">PDF Report</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">Monthly overview</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900 dark:text-white">
                        <Download size={12} /> EXPORT
                    </div>
                </div>
            </button>

            <button
                onClick={() => onExportClick('CSV')}
                className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group h-full text-left"
            >
                <div className="w-16 h-16 relative shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image src="/icons/csv-3d.png" alt="CSV" fill className="object-contain" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">CSV Spreadsheet</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">Raw data (.csv)</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900 dark:text-white">
                        <Download size={12} /> EXPORT
                    </div>
                </div>
            </button>
        </div>
    )
}

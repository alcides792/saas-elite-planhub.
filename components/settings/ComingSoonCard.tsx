import { Lock } from 'lucide-react'
import Image from 'next/image'

interface ComingSoonCardProps {
    icon?: React.ElementType
    image?: string
    title: string
    description: string
    color?: string
}

export default function ComingSoonCard({ icon: Icon, image, title, description, color }: ComingSoonCardProps) {
    return (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] shadow-sm dark:shadow-none opacity-60 relative overflow-hidden group cursor-not-allowed h-full">
            {/* Badge de Brevemente */}
            <div className="absolute top-4 right-4 px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                SOON
            </div>

            <div className="flex items-center gap-4 mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                {image ? (
                    <div className="w-12 h-12 relative shrink-0">
                        <Image src={image} alt={title} fill className="object-contain" />
                    </div>
                ) : Icon ? (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: color }}>
                        <Icon size={24} />
                    </div>
                ) : null}

                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-tight">{description}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                <Lock size={12} />
                <span>Currently Unavailable</span>
            </div>
        </div>
    )
}

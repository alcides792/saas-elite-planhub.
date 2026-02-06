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
        <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 opacity-60 relative overflow-hidden group cursor-not-allowed h-full">
            {/* Badge de Brevemente */}
            <div className="absolute top-4 right-4 px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-white/5">
                Brevemente
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
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-zinc-500 text-sm leading-tight">{description}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-zinc-600 text-sm">
                <Lock size={14} />
                <span>Indisponível no momento</span>
            </div>
        </div>
    )
}

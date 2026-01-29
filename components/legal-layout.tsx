import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface LegalLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">

                {/* Navigation */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-12 group"
                >
                    <div className="p-1 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Voltar ao Dashboard</span>
                </Link>

                {/* Content Container */}
                <div className="space-y-12">

                    {/* Header */}
                    <header className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <div className="h-1 w-20 bg-violet-600 rounded-full" />
                    </header>

                    {/* Text Content */}
                    <main className="prose prose-invert max-w-none prose-zinc 
            prose-h2:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg 
            prose-li:text-zinc-400 prose-ul:list-disc prose-ul:pl-6
            p-8 lg:p-12 rounded-2xl border border-white/10 bg-zinc-900/20 backdrop-blur-sm"
                    >
                        {children}
                    </main>

                </div>

                {/* Footer info */}
                <footer className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="text-zinc-600 text-xs">
                        &copy; {new Date().getFullYear()} Kovr - Smart Subscription Manager. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}

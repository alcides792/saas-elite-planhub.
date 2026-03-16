import React from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/utils/supabase/server';
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavbarActions } from "./NavbarActions";

export default async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-purple-600 p-1 rounded-lg">
                                <Zap className="w-5 h-5 fill-white text-white" />
                            </div>
                            <span className="text-white">Kovr</span>
                        </Link>
                    </div>


                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <NavbarActions user={user} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

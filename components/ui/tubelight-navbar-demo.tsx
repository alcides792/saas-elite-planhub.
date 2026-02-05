'use client'

import { Home, User, Briefcase, FileText, LayoutGrid, DollarSign, MessageCircle, HelpCircle } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo({ user }: { user?: any }) {
    const navItems = [
        { name: 'Home', url: '#', icon: Home },
        { name: 'Features', url: '#features', icon: LayoutGrid },
        { name: 'Pricing', url: '#pricing', icon: DollarSign },
        { name: 'FAQ', url: '#faq', icon: HelpCircle }
    ]

    return <NavBar items={navItems} user={user} />
}

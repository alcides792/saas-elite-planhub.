"use client"

import React, { useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon, LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    user?: any
}

export function NavBar({ items, className, user }: NavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMobile, setIsMobile] = useState(false)
    const { scrollY } = useScroll()

    // Smooth transforms based on scroll - extended ranges for smoother transitions
    const opacity = useTransform(scrollY, [0, 120], [0, 1])
    const scale = useTransform(scrollY, [0, 120], [0.8, 1])

    // Stretch animation: from pill to wide bar - smoother progression
    const navWidth = useTransform(scrollY, [0, 250], ["auto", "95%"])
    const navMaxWidth = useTransform(scrollY, [0, 250], ["550px", "1400px"])
    const navRadius = useTransform(scrollY, [0, 250], ["9999px", "20px"])
    const navPadding = useTransform(scrollY, [0, 250], ["4px", "8px 24px"])

    // Logo and Auth widths for layout stability - increased to avoid clipping
    const sideWidth = useTransform(scrollY, [50, 200], ["0px", "240px"])

    // Logo opacity and scale - appears when stretched
    const logoOpacity = useTransform(scrollY, [120, 250], [0, 1])
    const logoScale = useTransform(scrollY, [120, 250], [0.5, 1])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div
            className={cn(
                "fixed bottom-0 sm:top-0 sm:bottom-auto left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 w-full flex justify-center pointer-events-none",
                className,
            )}
        >
            <motion.div
                layout
                style={{
                    width: isMobile ? "95%" : navWidth,
                    maxWidth: isMobile ? "550px" : navMaxWidth,
                    borderRadius: isMobile ? "9999px" : navRadius,
                    padding: isMobile ? "6px" : navPadding
                }}
                className="flex items-center justify-center bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto transition-colors duration-300 hover:bg-black/50 pr-4 sm:pr-6"
            >
                {/* Left Section (Logo) */}
                <motion.div
                    style={{
                        opacity: isMobile ? 0 : logoOpacity,
                        scale: isMobile ? 0 : logoScale,
                        width: isMobile ? 0 : sideWidth
                    }}
                    className="hidden md:flex items-center gap-2 text-white font-bold text-lg tracking-wider overflow-hidden shrink-0 pl-2"
                >
                    <Image
                        src="/kovr-logo.png"
                        alt="Kovr Logo"
                        width={32}
                        height={32}
                        className="rounded-lg shrink-0"
                    />
                    <span className="whitespace-nowrap">KOVR</span>
                </motion.div>

                {/* Navigation Items - Perfectly Centered */}
                <div className="flex items-center gap-1 flex-1 justify-center">
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.name

                        return (
                            <Link
                                key={item.name}
                                href={item.url}
                                onClick={() => setActiveTab(item.name)}
                                className={cn(
                                    "relative cursor-pointer text-sm font-semibold px-4 sm:px-6 py-2 rounded-full transition-colors",
                                    "text-white/70 hover:text-white shrink-0",
                                    isActive && "text-white",
                                )}
                            >
                                <span className="hidden md:inline">{item.name}</span>
                                <span className="md:hidden">
                                    <Icon size={18} strokeWidth={2.5} />
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="lamp"
                                        className="absolute inset-0 w-full bg-white/10 rounded-full -z-10"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-500 rounded-t-full shadow-[0_0_10px_#a855f7]">
                                            <div className="absolute w-12 h-6 bg-purple-500/20 rounded-full blur-md -top-2 -left-2" />
                                        </div>
                                    </motion.div>
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Right Section (Auth) */}
                <motion.div
                    style={{ width: isMobile ? "auto" : sideWidth }}
                    className="flex items-center justify-end shrink-0"
                >
                    <AnimatePresence>
                        {(!user) ? (
                            <motion.div
                                key="auth-logged-out"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                style={{ opacity: isMobile ? 1 : opacity, scale: isMobile ? 1 : scale }}
                                className="flex items-center border-l border-white/10 ml-2 pl-2 gap-1 sm:gap-2 overflow-hidden"
                            >
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-xs font-bold px-3 sm:px-4 py-2 rounded-full text-white/70 hover:text-white transition-colors whitespace-nowrap"
                                >
                                    <LogIn size={14} />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 text-xs font-bold px-4 sm:px-6 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                >
                                    <UserPlus size={14} />
                                    <span className="hidden sm:inline">Join Free</span>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth-logged-in"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                style={{ opacity: isMobile ? 1 : opacity, scale: isMobile ? 1 : scale }}
                                className="flex items-center border-l border-white/10 ml-2 pl-2 overflow-hidden"
                            >
                                <Link
                                    href="/dashboard"
                                    className="bg-purple-600 text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 whitespace-nowrap"
                                >
                                    Dashboard
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 dark:bg-zinc-900/50 hover:bg-white/10 dark:hover:bg-zinc-800/80 border border-black/5 dark:border-white/10 backdrop-blur-xl transition-all duration-300 shadow-sm"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="text-purple-400"
                    >
                        <Moon size={20} strokeWidth={2.5} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="text-amber-500"
                    >
                        <Sun size={20} strokeWidth={2.5} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

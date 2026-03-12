'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    icon?: React.ElementType;
}

interface PremiumSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    icon?: React.ElementType;
}

export default function PremiumSelect({
    value,
    onChange,
    options,
    placeholder = "Select option",
    className = "",
    icon: Icon
}: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white transition-all hover:bg-gray-100 dark:hover:bg-white/10 focus:ring-2 focus:ring-[#1fe2c3]/50 outline-none"
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-gray-400 dark:text-zinc-500" />}
                    <span className="font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown
                    size={18}
                    className={`text-gray-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-[100] top-full left-0 w-full mt-2 p-2 bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${value === option.value
                                        ? 'bg-purple-500/10 text-purple-600 dark:bg-white/10 dark:text-white'
                                        : 'text-gray-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {option.icon && <option.icon size={18} />}
                                <span className="font-medium">{option.label}</span>
                                {value === option.value && <Check size={16} className="ml-auto text-purple-500 dark:text-white" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

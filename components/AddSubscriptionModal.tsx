'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Search, Plus, Calendar, DollarSign, Tag, CreditCard,
    Globe, ChevronRight, Check, ChevronDown,
    Tv, Music, Zap, Gamepad2, Users, Shield,
    Wrench, Activity, GraduationCap, Code, Palette, ShoppingBag, Box,
    ChevronLeft
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { format, addMonths, addYears, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addDays, subMonths } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import { POPULAR_SERVICES, Service, ServicePlan } from '@/lib/data/services';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (subscription: any) => void;
}


const CATEGORIES = [
    { id: 'entertainment', name: 'Entertainment', icon: Tv },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'productivity', name: 'Productivity', icon: Zap },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'utilities', name: 'Utilities', icon: Wrench },
    { id: 'health', name: 'Health', icon: Activity },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'dev', name: 'Development', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
    { id: 'other', name: 'Other', icon: Box },
];

function CategorySelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selected = CATEGORIES.find(c => c.id === value) || CATEGORIES[CATEGORIES.length - 1];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between pl-4 pr-4 py-3 bg-transparent border border-gray-200 dark:border-[#333] rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all"
            >
                <div className="flex items-center gap-3">
                    <selected.icon size={18} className="text-zinc-400 dark:text-white/40" />
                    <span>{selected.name}</span>
                </div>
                <ChevronDown size={18} className={`text-zinc-400 dark:text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.99 }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute z-[1000] top-full left-0 w-full mt-2 p-1.5 bg-white dark:bg-[#000] border border-gray-200 dark:border-[#222] rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    onChange(cat.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-all ${value === cat.id ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <cat.icon size={16} />
                                <span className="text-sm font-medium">{cat.name}</span>
                                {value === cat.id && <Check size={14} className="ml-auto" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PremiumDatePicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset view to selected date when opening
    useEffect(() => {
        if (isOpen && value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setCurrentMonth(date);
            }
        }
    }, [isOpen]);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="w-full flex items-center gap-3 pl-4 pr-4 py-3 bg-transparent border border-gray-200 dark:border-[#333] rounded-md text-gray-900 dark:text-white outline-none transition-all group hover:border-gray-300 dark:hover:border-white/20"
            >
                <Calendar className="text-zinc-400 dark:text-white/20 group-hover:text-zinc-600 dark:group-hover:text-white/40 transition-colors" size={18} />
                <span className={value ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-white/20'}>
                    {value ? format(new Date(value), 'PPP') : 'Select date'}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.99 }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute z-[1000] top-full right-0 mt-2 p-4 bg-white dark:bg-[#000] border border-gray-200 dark:border-[#222] rounded-lg shadow-xl w-72"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentMonth(prev => subMonths(prev, 1));
                                }}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-[10px] font-semibold text-gray-900 dark:text-white uppercase tracking-widest min-w-[120px] text-center">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentMonth(prev => addMonths(prev, 1));
                                }}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-zinc-300 dark:text-white/20 py-1">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, idx) => {
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const isToday = isSameDay(day, new Date());
                                const isCurrentMonth = isSameMonth(day, currentMonth);

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onChange(format(day, 'yyyy-MM-dd'));
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            h-8 w-8 rounded-md flex items-center justify-center text-[10px] transition-all
                                            ${isSelected ? 'bg-gray-900 text-white dark:bg-white dark:text-black font-semibold uppercase tracking-tight' :
                                                isToday ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white ring-1 ring-gray-200 dark:ring-white/10' :
                                                    isCurrentMonth ? 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white font-medium' : 'text-gray-300 dark:text-white/10'}
                                        `}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange(format(new Date(), 'yyyy-MM-dd'));
                                    setIsOpen(false);
                                }}
                                className="flex-1 py-1.5 rounded-md bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-semibold text-[9px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="flex-1 py-1.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[9px] uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
function ServiceLogo({
    service,
    size = "md"
}: {
    service: { name: string, domain: string, color: string },
    size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [service.domain]);

    const containerSizeClasses = {
        sm: 'w-10 h-10 rounded-md',
        md: 'w-14 h-14 rounded-lg',
        lg: 'w-16 h-16 rounded-lg',
        xl: 'w-20 h-20 rounded-xl'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl'
    };

    return (
        <div className={`relative ${containerSizeClasses[size]} bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}>
            {!imageError ? (
                <Image
                    src={`https://www.google.com/s2/favicons?domain=${service.domain}&sz=128`}
                    alt={service.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover bg-white"
                    onError={() => setImageError(true)}
                    unoptimized
                />
            ) : (
                <div
                    className={`w-full h-full flex items-center justify-center text-white font-black ${textSizes[size]}`}
                    style={{ backgroundColor: service.color || '#333' }}
                >
                    {service.name.charAt(0)}
                </div>
            )}
        </div>
    );
}

type ModalStep = 'select-service' | 'select-plan' | 'form';

export default function AddSubscriptionModal({ isOpen, onClose, onAdd }: AddSubscriptionModalProps) {
    const { preferences } = useUser();
    const [step, setStep] = useState<ModalStep>('select-service');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        amount: '',
        currency: preferences.currency || 'USD',
        billing_cycle: 'monthly' as 'monthly' | 'yearly',
        category: 'other',
        paymentMethod: 'card',
        next_payment: '',
        color: '#6366f1',
    });

    const handleCycleChange = (cycle: 'monthly' | 'yearly') => {
        setFormData(prev => ({
            ...prev,
            billing_cycle: cycle,
            next_payment: format(
                cycle === 'monthly' ? addMonths(new Date(), 1) : addYears(new Date(), 1),
                'yyyy-MM-dd'
            )
        }));
    };

    // Reset modal when opened
    useEffect(() => {
        if (isOpen) {
            setStep('select-service');
            setSearchQuery('');
            setSelectedService(null);
            setSelectedPlan(null);
        }
    }, [isOpen]);

    // Filter services based on search
    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return POPULAR_SERVICES.slice(0, 24); // Show top 24 initially
        const query = searchQuery.toLowerCase();
        return POPULAR_SERVICES.filter(
            s => s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query) ||
                s.domain.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
        if (service.plans && service.plans.length > 0) {
            setStep('select-plan');
        } else {
            setFormData({
                ...formData,
                name: service.name,
                website: `https://${service.domain}`,
                category: service.category.toLowerCase(),
                color: service.color,
                billing_cycle: 'monthly',
                next_payment: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
            });
            setStep('form');
        }
    };

    const handlePlanSelect = (plan: ServicePlan) => {
        if (!selectedService) return;
        setSelectedPlan(plan);
        setFormData({
            ...formData,
            name: selectedService.name,
            website: `https://${selectedService.domain}`,
            amount: plan.price.toString(),
            category: selectedService.category.toLowerCase(),
            color: selectedService.color,
            billing_cycle: 'monthly',
            next_payment: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
        });
        setStep('form');
    };

    const handleManualAdd = () => {
        setFormData({
            name: '',
            website: '',
            amount: '',
            currency: preferences.currency || 'USD',
            billing_cycle: 'monthly',
            category: 'other',
            paymentMethod: 'card',
            next_payment: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
            color: '#6366f1',
        });
        setStep('form');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            amount: parseFloat(formData.amount),
            next_payment: formData.next_payment || null,
            status: 'active',
        });
        handleClose();
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep('select-service');
            setSearchQuery('');
            setSelectedService(null);
            setSelectedPlan(null);
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="w-full max-w-3xl bg-white dark:bg-[#000] rounded-xl border border-gray-200 dark:border-[#222] shadow-2xl flex flex-col min-h-[600px] max-h-[95vh] relative"
                        >
                            {/* Header */}
                            <div className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white uppercase tracking-tight">
                                            {step === 'select-service' && 'Add Subscription'}
                                            {step === 'select-plan' && `Choose a Plan`}
                                            {step === 'form' && 'Details'}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {step === 'select-service' && 'Explore 150+ popular services'}
                                            {step === 'select-plan' && `Select your current ${selectedService?.name} tier`}
                                            {step === 'form' && 'Review and finalize your subscription'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-200 dark:border-white/5"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {step === 'select-service' && (
                                        <div className="relative">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search Netflix, Spotify, ChatGPT..."
                                                className="w-full pl-12 pr-6 py-4 bg-transparent border border-gray-200 dark:border-[#333] rounded-lg text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                                                autoFocus
                                            />
                                        </div>
                                )}
                            </div>

                            {/* Content Scrollable Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
                                <AnimatePresence mode="wait">
                                    {step === 'select-service' && (
                                        <motion.div
                                            key="select-service"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4"
                                        >
                                            {filteredServices.map((service, index) => (
                                                <motion.button
                                                    key={service.id}
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    onClick={() => handleServiceClick(service)}
                                                    onMouseEnter={() => setHoveredId(service.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                    className="relative group p-4 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] transition-all text-left overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                                                    style={{
                                                        boxShadow: hoveredId === service.id
                                                            ? `0 20px 40px ${service.color}15`
                                                            : 'none'
                                                    }}
                                                >
                                                    {/* Background Glow */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                                        style={{ background: `radial-gradient(circle at center, ${service.color}, transparent 70%)` }}
                                                    />

                                                    <div className="flex flex-col gap-4 relative z-10">
                                                        <ServiceLogo service={service} size="md" />
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight uppercase tracking-tight">{service.name}</h4>
                                                            <p className="text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-widest mt-1">{service.category}</p>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {step === 'select-plan' && (
                                        <motion.div
                                            key="select-plan"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-3 py-4"
                                        >
                                            <div className="flex items-center gap-4 mb-8 p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                                <ServiceLogo service={selectedService!} size="lg" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white uppercase tracking-tight">{selectedService?.name}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">{selectedService?.category}</p>
                                                </div>
                                            </div>

                                            {selectedService?.plans.map((plan) => (
                                                <button
                                                    key={plan.name}
                                                    onClick={() => handlePlanSelect(plan)}
                                                    className="w-full p-6 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] transition-all text-left flex items-center justify-between group shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
                                                >
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg uppercase tracking-tight">{plan.name}</h4>
                                                        <p className="text-gray-500 dark:text-gray-400 text-base mt-0.5">${plan.price.toFixed(2)} / month</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setStep('form')}
                                                className="w-full p-4 rounded-lg border border-dashed border-gray-200 dark:border-[#333] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 transition-all text-xs font-medium uppercase tracking-widest text-center"
                                            >
                                                Custom price / tier
                                            </button>
                                        </motion.div>
                                    )}

                                    {step === 'form' && (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6 py-4"
                                        >
                                            {/* Preview Hero */}
                                            <div
                                                className="relative p-8 rounded-lg overflow-hidden border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-white/[0.02]"
                                            >
                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                    <div className="w-32 h-32 blur-3xl rounded-full" style={{ background: formData.color }} />
                                                </div>

                                                <div className="flex items-center gap-6 relative z-10">
                                                    <ServiceLogo
                                                        service={{
                                                            name: formData.name,
                                                            domain: formData.website.replace(/^https?:\/\//, '').split('/')[0],
                                                            color: formData.color
                                                        }}
                                                        size="xl"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="text-2xl font-semibold bg-transparent text-gray-900 dark:text-white border-none focus:ring-0 p-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 w-full truncate uppercase tracking-tight"
                                                            placeholder="Service Name"
                                                        />
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-lg font-medium text-gray-400 dark:text-gray-500">{formData.currency === 'USD' ? '$' : 'R$'}</span>
                                                            <input
                                                                type="text"
                                                                value={formData.amount}
                                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                                className="text-lg font-medium bg-transparent text-gray-900 dark:text-white border-none focus:ring-0 p-0 placeholder:text-gray-300 dark:placeholder:text-gray-700 w-24"
                                                                placeholder="0.00"
                                                            />
                                                            <span className="text-base text-gray-400 dark:text-gray-500">/ month</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="group">
                                                        <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Website</label>
                                                        <div className="relative">
                                                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                                                              <input
                                                                  type="url"
                                                                  value={formData.website}
                                                                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                                  className="w-full pl-11 pr-4 py-3 bg-transparent border border-gray-200 dark:border-[#333] rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all text-sm"
                                                              />
                                                        </div>
                                                    </div>

                                                    <div className="group">
                                                        <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Billing Cycle</label>
                                                        <div className="flex gap-2">
                                                            {['monthly', 'yearly'].map((cycle) => (
                                                                <button
                                                                    key={cycle}
                                                                    type="button"
                                                                    onClick={() => handleCycleChange(cycle as any)}
                                                                    className={`flex-1 py-3 rounded-md border transition-all text-[11px] font-semibold uppercase tracking-wider ${formData.billing_cycle === cycle
                                                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                                                                        : 'bg-transparent text-gray-400 border-gray-200 dark:border-[#333] dark:text-gray-500 hover:border-gray-300 dark:hover:border-white/10'
                                                                        }`}
                                                                >
                                                                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="group">
                                                        <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Category</label>
                                                        <CategorySelect
                                                            value={formData.category}
                                                            onChange={(val) => setFormData({ ...formData, category: val })}
                                                        />
                                                    </div>

                                                    <div className="group">
                                                        <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Next Payment</label>
                                                        <PremiumDatePicker
                                                            value={formData.next_payment}
                                                            onChange={(val) => setFormData({ ...formData, next_payment: val })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(selectedService ? 'select-plan' : 'select-service')}
                                                    className="px-6 py-3 rounded-md bg-transparent text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 transition-all border border-gray-200 dark:border-[#333]"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-3 rounded-md bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-widest shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                                                    disabled={!formData.name || !formData.amount}
                                                >
                                                    Confirm Subscription
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer - Only on Select Service Step */}
                            {step === 'select-service' && (
                                <div className="p-8 pt-0 mt-auto border-t border-slate-100 dark:border-white/5">
                                    <button
                                        onClick={handleManualAdd}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-[#222] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-[11px] font-semibold uppercase tracking-widest group"
                                    >
                                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                        <span>Not on the list? Create Custom</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}


'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    getDate,
    getMonth,
    getYear,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertTriangle,
    CreditCard,
    TrendingUp,
    Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { Subscription, dbToSubscription } from '@/types';
import SubscriptionLogo from '@/components/ui/subscription-logo';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchSubscriptions() {
            setLoading(true);
            setError(null);
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                console.log('[Calendar Fetch] User ID:', user.id);

                const { data, error: sbError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id);

                if (sbError) throw sbError;

                console.log('[Calendar Fetch] Raw data from Supabase:', data);
                console.log('[Calendar Fetch] Count:', data?.length || 0);

                const mapped = (data || []).map((dbSub: any) => dbToSubscription(dbSub));
                console.log('[Calendar Fetch] Mapped subscriptions:', mapped);
                setSubscriptions(mapped);
            } catch (err: any) {
                console.error('[Calendar Fetch] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscriptions();
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDateView = startOfWeek(monthStart);
    const endDateView = endOfWeek(monthEnd);

    const calendarDays = useMemo(() => {
        return eachDayOfInterval({
            start: startDateView,
            end: endDateView
        });
    }, [startDateView, endDateView]);

    // Robust Recurrence & Termination Logic
    const projectedEvents = useMemo(() => {
        const events: { date: Date; subscription: Subscription }[] = [];
        const viewedMonthIndex = getMonth(currentDate);
        const viewedYear = getYear(currentDate);

        console.log(`\n--- [Calendar Projection] Month: ${viewedMonthIndex + 1}/${viewedYear} ---`);
        console.log(`[Calendar Projection] Total subscriptions to process: ${subscriptions.length}`);

        subscriptions.forEach(sub => {
            // 1. Get the next_payment string (this is actually the NEXT upcoming renewal)
            const nextPaymentStr = sub.next_payment || (sub as any).renewal_date;

            if (!nextPaymentStr) {
                console.warn(`[SKIP] ${sub.name}: No next_payment date.`);
                return;
            }

            // 2. Parse the full next_payment date (this is the reference date)
            const datePart = nextPaymentStr.split('T')[0];
            const parts = datePart.split('-');
            const nextPaymentYear = parseInt(parts[0], 10);
            const nextPaymentMonth = parseInt(parts[1], 10) - 1; // 0-indexed
            const payDay = parseInt(parts[2], 10);

            if (isNaN(payDay) || payDay < 1 || payDay > 31) {
                console.error(`[SKIP] ${sub.name}: Invalid date parsed from "${nextPaymentStr}"`);
                return;
            }

            const nextPaymentDate = new Date(nextPaymentYear, nextPaymentMonth, payDay);

            // 3. Get billing cycle
            const cycle = ((sub as any).billing_cycle || (sub as any).billing_type || 'monthly').toLowerCase().trim();

            console.log(`[Processing] ${sub.name} | Cycle: "${cycle}" | NextPayment: ${format(nextPaymentDate, 'yyyy-MM-dd')}`);

            // 4. Calculate the last day of the viewed month
            const lastDayOfViewedMonth = getDate(endOfMonth(currentDate));
            const actualDay = Math.min(payDay, lastDayOfViewedMonth);

            // 5. Create the projected date for the viewed month
            const projectedDate = new Date(viewedYear, viewedMonthIndex, actualDay);

            // 6. CHECK IF VIEWED MONTH IS THE EXACT RENEWAL MONTH
            // The subscription should ONLY appear in the exact month/year of the renewal_date
            // It will not appear in other months - users need to update renewal_date after each payment

            if (viewedMonthIndex !== nextPaymentMonth || viewedYear !== nextPaymentYear) {
                console.log(`   -> ❌ Viewed ${viewedMonthIndex + 1}/${viewedYear} != renewal ${nextPaymentMonth + 1}/${nextPaymentYear}. Skipping.`);
                return;
            }

            // 7. END DATE FILTER
            const endDateStr = sub.end_date;
            if (endDateStr) {
                try {
                    const endDatePart = endDateStr.split('T')[0];
                    const endParts = endDatePart.split('-');
                    const endYear = parseInt(endParts[0], 10);
                    const endMonth = parseInt(endParts[1], 10) - 1;
                    const endDay = parseInt(endParts[2], 10);
                    const endDate = new Date(endYear, endMonth, endDay);

                    // If projected date is STRICTLY AFTER end_date, skip
                    if (projectedDate > endDate) {
                        console.log(`   -> ❌ Skipped due to end_date: projected ${format(projectedDate, 'yyyy-MM-dd')} > end ${format(endDate, 'yyyy-MM-dd')}`);
                        return;
                    }
                } catch (e) {
                    console.error(`   -> Failed to parse end_date "${endDateStr}"`, e);
                }
            }

            console.log(`   -> ✅ Added event for ${sub.name} on day ${getDate(projectedDate)}`);
            events.push({ date: projectedDate, subscription: sub });
        });

        console.log(`--- [Calendar Projection] Total events: ${events.length} ---\n`);
        return events;
    }, [subscriptions, currentDate]);

    const getDayEvents = (day: Date) => {
        return projectedEvents.filter(event => isSameDay(event.date, day));
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold">Erro ao carregar calendário</h2>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-6 min-h-screen bg-[#050505] text-white">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Calendário Financeiro
                    </h1>
                    <p className="text-gray-400 mt-1">Visão geral dos seus pagamentos</p>
                </div>

                <div className="flex items-center gap-4 bg-[#111] p-1.5 rounded-2xl border border-white/5">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-medium min-w-[140px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none mb-2">Renovações este mês</p>
                        <p className="text-3xl font-black text-white">{projectedEvents.length}</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-purple-600 opacity-20" />
                </div>
                <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none mb-2">Total Estimado</p>
                        <p className="text-3xl font-black text-green-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                projectedEvents.reduce((acc, curr) => acc + curr.subscription.amount, 0)
                            )}
                        </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600 opacity-20" />
                </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-7 border-b border-white/5 bg-[#0f0f0f]">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="p-4 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 min-h-[500px] sm:min-h-[600px]">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getDayEvents(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    relative p-2 sm:p-4 border-r border-b border-white/5 min-h-[90px] sm:min-h-[120px] flex flex-col gap-2
                                    ${!isCurrentMonth ? 'opacity-20 bg-black/40' : 'hover:bg-white/[0.02]'}
                                    ${idx % 7 === 6 ? 'border-r-0' : ''}
                                `}
                            >
                                <span className={`text-xs sm:text-sm font-semibold inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${isToday ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>
                                    {format(day, 'd')}
                                </span>

                                <div className="space-y-1.5">
                                    {dayEvents.map((event, eIdx) => {
                                        // Extract clean domain for SubscriptionLogo
                                        const domain = event.subscription.website
                                            ?.replace(/^https?:\/\//, '')
                                            .replace(/^www\./, '')
                                            .split('/')[0];

                                        return (
                                            <motion.div
                                                key={`${event.subscription.id}-${eIdx}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                title={`${event.subscription.name}: ${event.subscription.currency} ${event.subscription.amount}`}
                                                className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-help group"
                                            >
                                                <SubscriptionLogo
                                                    name={event.subscription.name}
                                                    domain={domain}
                                                    size="sm"
                                                    iconColor={event.subscription.iconColor || undefined}
                                                />
                                                <div className="truncate text-[10px] sm:text-xs text-gray-400 group-hover:text-white font-medium">
                                                    {event.subscription.name}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
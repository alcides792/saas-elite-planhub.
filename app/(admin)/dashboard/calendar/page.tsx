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
import { enUS } from 'date-fns/locale';
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
import { createClient } from '@/lib/utils/supabase/client';
import { Subscription, dbToSubscription } from '@/types';
import SubscriptionLogo from '@/components/ui/subscription-logo';
import { ThemeToggle } from '@/components/ThemeToggle';

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


                const { data, error: sbError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id);

                if (sbError) throw sbError;


                const mapped = (data || []).map((dbSub: any) => dbToSubscription(dbSub));
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


            // 4. Calculate the last day of the viewed month
            const lastDayOfViewedMonth = getDate(endOfMonth(currentDate));
            const actualDay = Math.min(payDay, lastDayOfViewedMonth);

            // 5. Create the projected date for the viewed month
            const projectedDate = new Date(viewedYear, viewedMonthIndex, actualDay);

            // 6. CHECK IF VIEWED MONTH IS THE EXACT RENEWAL MONTH
            // The subscription should ONLY appear in the exact month/year of the renewal_date
            // It will not appear in other months - users need to update renewal_date after each payment

            if (viewedMonthIndex !== nextPaymentMonth || viewedYear !== nextPaymentYear) {
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
                        return;
                    }
                } catch (e) {
                    console.error(`   -> Failed to parse end_date "${endDateStr}"`, e);
                }
            }

            events.push({ date: projectedDate, subscription: sub });
        });

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
                <h2 className="text-xl font-semibold">Error loading calendar</h2>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-6 min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Financial Calendar
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Overview of your payments</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#111] p-1.5 rounded-2xl border border-gray-200 dark:border-white/5">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-white/5 rounded-xl transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-lg font-bold min-w-[140px] text-center capitalize text-gray-900 dark:text-white">
                            {format(currentDate, 'MMMM yyyy', { locale: enUS })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-white/5 rounded-xl transition-all">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex items-center justify-between shadow-sm dark:shadow-none">
                    <div>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs font-black uppercase tracking-widest leading-none mb-2">Renewals this month</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{projectedEvents.length}</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-purple-600 opacity-20" />
                </div>
                <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex items-center justify-between shadow-sm dark:shadow-none">
                    <div>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs font-black uppercase tracking-widest leading-none mb-2">Estimated Total</p>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                                projectedEvents.reduce((acc, curr) => acc + curr.subscription.amount, 0)
                            )}
                        </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-600 opacity-20" />
                </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0f0f0f]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-4 text-center text-[10px] sm:text-xs font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest">
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
                                    relative p-2 sm:p-4 border-r border-b border-gray-200 dark:border-white/5 min-h-[90px] sm:min-h-[120px] flex flex-col gap-2 transition-colors
                                    ${!isCurrentMonth ? 'opacity-20 bg-gray-100 dark:bg-black/40' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}
                                    ${idx % 7 === 6 ? 'border-r-0' : ''}
                                `}
                            >
                                <span className={`text-xs sm:text-sm font-bold inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${isToday ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 dark:text-gray-500'}`}>
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
                                                className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-purple-500/30 transition-all cursor-help group shadow-sm dark:shadow-none"
                                            >
                                                <SubscriptionLogo
                                                    name={event.subscription.name}
                                                    domain={domain}
                                                    size="sm"
                                                    iconColor={event.subscription.iconColor || undefined}
                                                />
                                                <div className="truncate text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-white font-bold transition-colors">
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
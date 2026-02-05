'use client';

import React from 'react';

export default function KineticDotsLoader() {
    const dots = 4;

    return (
        <div className='flex items-center justify-center min-h-screen w-full bg-black z-[100] fixed inset-0'>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gravity-bounce {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-40px); }
                    100% { transform: translateY(0); }
                }

                @keyframes rubber-morph {
                    0% { transform: scale(1.4, 0.6); }
                    5% { transform: scale(0.9, 1.1); }
                    15% { transform: scale(1, 1); }
                    50% { transform: scale(1, 1); }
                    85% { transform: scale(0.9, 1.1); }
                    100% { transform: scale(1.4, 0.6); }
                }

                @keyframes shadow-breathe {
                    0% { transform: scale(1.4); opacity: 0.6; }
                    50% { transform: scale(0.5); opacity: 0.1; }
                    100% { transform: scale(1.4); opacity: 0.6; }
                }

                @keyframes ripple-expand {
                    0% { transform: scale(0.5); opacity: 0; border-width: 4px; }
                    5% { opacity: 0.8; }
                    30% { transform: scale(1.5); opacity: 0; border-width: 0px; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}} />
            <div className='flex gap-8'>
                {[...Array(dots)].map((_, i) => (
                    <div
                        key={i}
                        className='relative flex flex-col items-center justify-end h-24 w-8'
                    >
                        {/* 1. THE BOUNCING DOT (Metallic Silver/Chrome) */}
                        <div
                            className='relative w-6 h-6 z-10'
                            style={{
                                animationName: 'gravity-bounce',
                                animationDuration: '1.4s',
                                animationTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                                animationIterationCount: 'infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        >
                            <div
                                className='w-full h-full rounded-full bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_3px_rgba(0,0,0,0.4)]'
                                style={{
                                    animationName: 'rubber-morph',
                                    animationDuration: '1.4s',
                                    animationTimingFunction: 'linear',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />

                            {/* Specular Metallic reflections */}
                            <div className='absolute top-1 left-1.5 w-2 h-2 bg-white/80 rounded-full blur-[0.4px]' />
                            <div className='absolute bottom-1 right-1.5 w-1 h-1 bg-white/20 rounded-full blur-[1px]' />
                        </div>

                        {/* 2. FLOOR RIPPLE (Metallic Shine ripple) */}
                        <div
                            className='absolute bottom-0 w-12 h-4 border border-zinc-400/30 rounded-[100%] opacity-0'
                            style={{
                                animationName: 'ripple-expand',
                                animationDuration: '1.4s',
                                animationTimingFunction: 'linear',
                                animationIterationCount: 'infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />

                        {/* 3. REFLECTIVE SHADOW */}
                        <div
                            className='absolute -bottom-1 w-6 h-2 rounded-[100%] bg-zinc-400/20 blur-md'
                            style={{
                                animationName: 'shadow-breathe',
                                animationDuration: '1.4s',
                                animationTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                                animationIterationCount: 'infinite',
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

'use client';

import { useState } from 'react';

interface SubscriptionLogoProps {
    name: string;
    domain?: string;
    size?: 'sm' | 'md' | 'lg';
    iconColor?: string;
    className?: string;
}

export default function SubscriptionLogo({
    name,
    domain,
    size = 'md',
    iconColor = 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    className = ''
}: SubscriptionLogoProps) {
    const [imageError, setImageError] = useState(false);

    // Size mappings - h-10 w-10 as default (md)
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-base',
        lg: 'h-14 w-14 text-xl'
    };

    const imageSizes = {
        sm: 32,
        md: 64,
        lg: 128
    };

    const getInitials = () => {
        return name.charAt(0).toUpperCase();
    };

    // If no domain or image failed, show fallback avatar with initial
    if (!domain || imageError) {
        return (
            <div
                className={`${sizeClasses[size]} rounded-xl flex items-center justify-center text-white font-bold shadow-sm border border-white/10 ${className}`}
                style={{ background: iconColor }}
            >
                {getInitials()}
            </div>
        );
    }

    // Show logo from Google Favicon API
    return (
        <div className={`${sizeClasses[size]} rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-sm border border-gray-200/50 ${className}`}>
            <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${imageSizes[size]}`}
                alt={`${name} logo`}
                className="w-full h-full object-contain p-1.5"
                onError={() => setImageError(true)}
            />
        </div>
    );
}

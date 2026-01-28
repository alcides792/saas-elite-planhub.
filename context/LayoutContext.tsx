'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface LayoutContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
    toggleTheme: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<Theme>('dark');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('elite-theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage
    useEffect(() => {
        localStorage.setItem('elite-theme', theme);
        console.log('LayoutContext: Theme changed to:', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <LayoutContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                theme,
                setTheme,
                toggleSidebar,
                toggleTheme,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
}

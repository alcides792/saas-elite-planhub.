import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type Theme = 'dark' | 'light';

interface LayoutContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    theme: Theme;
    setTheme: (theme: string) => void;
    toggleSidebar: () => void;
    toggleTheme: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { theme, setTheme, resolvedTheme } = useTheme();

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    return (
        <LayoutContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                theme: (resolvedTheme as Theme) || 'dark',
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

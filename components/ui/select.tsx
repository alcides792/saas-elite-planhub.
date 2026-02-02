'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps {
    children: React.ReactNode
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
} | null>(null)

export function Select({ children, defaultValue, value, onValueChange }: SelectProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [isOpen, setIsOpen] = React.useState(false)

    const val = value !== undefined ? value : internalValue
    const handleValueChange = (newVal: string) => {
        if (value === undefined) setInternalValue(newVal)
        if (onValueChange) onValueChange(newVal)
        setIsOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: val, onValueChange: handleValueChange, isOpen, setIsOpen }}>
            <div className="relative w-full">{children}</div>
        </SelectContext.Provider>
    )
}

export function SelectTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const context = React.useContext(SelectContext)
    if (!context) return null

    return (
        <button
            type="button"
            onClick={() => context.setIsOpen(!context.isOpen)}
            className={`flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(SelectContext)
    if (!context) return null
    return <span>{context.value || placeholder}</span>
}

export function SelectContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const context = React.useContext(SelectContext)
    if (!context || !context.isOpen) return null

    return (
        <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-1 text-zinc-200 shadow-md ${className}`}>
            {children}
        </div>
    )
}

export function SelectItem({ children, value, className = "" }: { children: React.ReactNode; value: string; className?: string }) {
    const context = React.useContext(SelectContext)
    if (!context) return null

    const isSelected = context.value === value

    return (
        <button
            type="button"
            onClick={() => context.onValueChange?.(value)}
            className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-zinc-800 focus:bg-zinc-800 ${isSelected ? "bg-zinc-800 text-white" : ""
                } ${className}`}
        >
            {isSelected && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                </span>
            )}
            {children}
        </button>
    )
}

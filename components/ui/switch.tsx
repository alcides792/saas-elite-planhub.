'use client'

import * as React from "react"
import { motion } from "framer-motion"

interface SwitchProps {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked: controlledChecked, defaultChecked, onCheckedChange, className = "" }, ref) => {
        const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
        const isControlled = controlledChecked !== undefined
        const checked = isControlled ? controlledChecked : internalChecked

        const toggle = () => {
            const newChecked = !checked
            if (!isControlled) setInternalChecked(newChecked)
            if (onCheckedChange) onCheckedChange(newChecked)
        }

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={toggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-purple-600" : "bg-zinc-700"
                    } ${className}`}
            >
                <motion.span
                    animate={{ x: checked ? 22 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0"
                />
            </button>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }

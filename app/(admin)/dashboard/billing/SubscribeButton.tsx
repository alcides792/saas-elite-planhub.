'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/checkout'
import { toast } from 'sonner'

export default function SubscribeButton() {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const result = await createCheckoutSession()
            if (result.url) {
                window.location.href = result.url // Redirect to Dodo
            } else {
                toast.error("Error initiating payment: " + (result.error || "Unknown"))
            }
        } catch (err) {
            toast.error("Connection failure.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 px-6 bg-black text-white font-bold text-lg rounded-xl hover:bg-zinc-900 transition transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? 'Processing...' : 'Start 3-Day Free Trial 🚀'}
        </button>
    )
}

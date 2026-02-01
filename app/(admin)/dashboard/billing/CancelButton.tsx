'use client'

import { useState } from 'react'
import { cancelSubscription } from '@/app/actions/billing'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CancelButton({ subscriptionId }: { subscriptionId: string | null }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your Premium subscription?")) return

        setLoading(true)
        try {
            const result = await cancelSubscription(subscriptionId)

            if (result.success) {
                toast.success(result.message)
                router.refresh() // Refresh page to remove card
            } else {
                toast.error(result.message) // Show exact error to user
            }
        } catch (error) {
            toast.error("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full group relative flex justify-center py-3 px-4 border border-red-900/30 text-sm font-medium rounded-md text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    Cancel Subscription
                </span>
            )}
        </button>
    )
}

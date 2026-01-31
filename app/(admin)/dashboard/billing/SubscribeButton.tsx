'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/checkout'

export default function SubscribeButton() {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const result = await createCheckoutSession()
            if (result.url) {
                window.location.href = result.url // Redireciona para o Dodo
            } else {
                alert("Erro ao iniciar pagamento: " + (result.error || "Desconhecido"))
            }
        } catch (err) {
            alert("Erro de conexão.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 px-6 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? 'Redirecionando...' : 'Assinar Agora - R$ 27,00'}
        </button>
    )
}

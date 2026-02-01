'use server'

import { requireProPlan } from '@/utils/gatekeeper'

/**
 * Perform an AI request.
 * Protected by Pro plan gate.
 */
export async function askAI(message: string) {
    // 🔒 TRAVA DE SEGURANÇA
    const isPro = await requireProPlan()
    if (!isPro) {
        return { error: "Bloqueado: A IA Financeira é exclusiva para assinantes Pro." }
    }

    // Note: Most AI logic happens in app/api/chat/route.ts via useChat.
    // This action can be used for direct AI calls if needed.

    return { success: true, message: "IA funcionando (Protegida)" }
}

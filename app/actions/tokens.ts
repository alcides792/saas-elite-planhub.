'use server'

import { requireProPlan } from '@/utils/gatekeeper'
import { createClient } from '@/utils/supabase/server'

/**
 * Generate a new extension token for the authenticated user.
 * Protected by Pro plan gate.
 */
export async function generateExtensionToken() {
    // 🔒 TRAVA DE SEGURANÇA
    const isPro = await requireProPlan()
    if (!isPro) {
        return { error: "Blocked: Token generation is exclusive to the Pro plan." };
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: "Não autorizado." }

        // Logic to generate token (similar to generateApiKey in api-keys.ts)
        const newToken = crypto.randomUUID()

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ extension_token: newToken })
            .eq('id', user.id)

        if (updateError) throw updateError

        return { success: true, token: newToken }
    } catch (error: any) {
        console.error('Error generating token:', error)
        return { error: "Erro ao gerar token." }
    }
}

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ReactNode } from 'react'
import AdminClientLayout from './AdminClientLayout'

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient()

    // --- VERIFICAÇÃO DE SEGURANÇA ---
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Se não tiver usuário, manda pro login e PARA aqui.
        redirect('/login')
    }
    // ---------------------------------

    return (
        <AdminClientLayout>
            {children}
        </AdminClientLayout>
    )
}

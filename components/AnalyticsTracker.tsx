'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Este componente envia um evento de "view" para o seu Admin cada vez que a rota muda.
 * Restrito apenas à Landing Page (/).
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Restrição: monitorar APENAS a landing page
    if (pathname !== '/') return

    // Evitar tracking duplicado na mesma página em desenvolvimento
    if (lastTrackedPath.current === pathname) return
    
    // Configurações (Ajuste para o domínio do seu Admin)
    const ADMIN_API_URL = 'https://meu-admin-domain.netlify.app/api/analytics/hit'
    const ANALYTICS_KEY = process.env.NEXT_PUBLIC_ANALYTICS_SECRET_KEY || 'your-secret-key-here12345'
    const SITE_ID = 'meu-saas-id' // Identificador deste site

    async function trackView() {
      try {
        await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-analytics-key': ANALYTICS_KEY
          },
          body: JSON.stringify({
            id: SITE_ID,
            type: 'view',
            label: pathname,
            sessionId: getSessionId(),
            referrer: document.referrer || 'Acesso Direto'
          }),
          // Importante: modo CORS para cross-domain
          mode: 'cors' 
        })
        lastTrackedPath.current = pathname
      } catch (err) {
        console.error('Falha ao enviar analytics:', err)
      }
    }

    trackView()
  }, [pathname])

  return null
}

// Helper simples para ID de sessão (armazenado no sessionStore)
function getSessionId() {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('asid')
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('asid', sid)
  }
  return sid
}


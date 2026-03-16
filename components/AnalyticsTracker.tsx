'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackView } from '@/lib/utils/analytics-hits'

/**
 * Componente que monitora mudanças de rota e dispara o tracking de visualização.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Restrição: monitorar APENAS a landing page
    if (pathname !== '/') return

    // Evitar tracking duplicado na mesma página em desenvolvimento
    if (lastTrackedPath.current === pathname) return
    
    trackView(pathname)
    lastTrackedPath.current = pathname
  }, [pathname])

  return null
}


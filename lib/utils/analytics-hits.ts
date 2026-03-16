/**
 * Utilitários para disparar eventos de analytics para o painel administrativo.
 */

// Configurações (Ajuste para o domínio do seu Admin)
const ADMIN_API_URL = 'https://meuadimin.netlify.app/api/analytics/hit'
const ANALYTICS_KEY = process.env.NEXT_PUBLIC_ANALYTICS_SECRET_KEY || 'your-secret-key-here12345'
const SITE_ID = 'global' // Identificador deste site

// Helper simples para ID de sessão (armazenado no sessionStore)
export function getSessionId() {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('asid')
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('asid', sid)
  }
  return sid
}

/**
 * Função para rastrear visualizações de página.
 */
export async function trackView(pathname: string) {
  if (typeof window === 'undefined' || window.location.pathname !== '/') return

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
      mode: 'cors'
    })
  } catch (err) {
    console.error('Falha ao enviar analytics view:', err)
  }
}

/**
 * Função para rastrear cliques em botões/links específicos.
 * Restrita apenas à Landing Page (/).
 */
export async function trackClick(label: string) {
  if (typeof window === 'undefined' || window.location.pathname !== '/') return

  try {
    await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-key': ANALYTICS_KEY
      },
      body: JSON.stringify({
        id: SITE_ID,
        type: 'click',
        label: label,
        sessionId: getSessionId(),
        referrer: document.referrer || 'Acesso Direto'
      }),
      mode: 'cors'
    })
  } catch (err) {
    console.error('Falha ao enviar click analytics:', err)
  }
}

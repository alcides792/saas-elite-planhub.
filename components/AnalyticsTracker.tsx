"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  // Usamos um useRef para guardar a última URL rastreada e evitar envios duplicados 
  // (útil principalmente no Strict Mode do React em desenvolvimento)
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    // Se a URL atual for a mesma que a última rastreada, não enviamos novamente
    if (lastTrackedUrl.current === pathname) {
      return;
    }

    lastTrackedUrl.current = pathname;
    const label = pathname === "/" ? "home" : pathname;

    const hitAnalytics = async () => {
      try {
        const secretKey = process.env.NEXT_PUBLIC_ANALYTICS_SECRET_KEY;
        
        if (!secretKey) {
          console.error("Analytics Tracker: NEXT_PUBLIC_ANALYTICS_SECRET_KEY is missing in environment variables.");
          return;
        }

        await fetch("https://meuadimin.netlify.app/api/analytics/hit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-analytics-key": secretKey,
          },
          body: JSON.stringify({
            id: "global",
            type: "view",
            label: label,
          }),
        });
      } catch (error) {
        // Falha silenciosa: se o admin estiver offline ou ocorrer um erro de rede,
        // apenas logamos no console para não quebrar o SaaS.
        console.error("Analytics Tracker: Failed to send page view hit", error);
      }
    };

    hitAnalytics();
  }, [pathname]);

  return null;
}

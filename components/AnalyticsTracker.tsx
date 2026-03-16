"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Interface for the analytics payload
interface AnalyticsPayload {
  id: string;
  type: "view" | "click";
  label: string;
  referrer: string;
  sessionId: string;
}

// Function to get or create a session ID
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("saas_analytics_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("saas_analytics_session_id", sessionId);
  }
  return sessionId;
};

// Internal function to send the hit
const sendHit = async (payload: AnalyticsPayload) => {
  try {
    const secretKey = process.env.NEXT_PUBLIC_ANALYTICS_SECRET_KEY;
    
    if (!secretKey) {
      console.error("Analytics Tracker: NEXT_PUBLIC_ANALYTICS_SECRET_KEY is missing.");
      return;
    }

    await fetch("https://meuadimin.netlify.app/api/analytics/hit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-analytics-key": secretKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Analytics Tracker: Failed to send hit", error);
  }
};

// Exported function for manual click tracking
export const trackClick = (label: string) => {
  // Only track on landing page
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    return;
  }

  const sessionId = getSessionId();
  const payload: AnalyticsPayload = {
    id: "global",
    type: "click",
    label: label,
    referrer: document.referrer || "Acesso Direto",
    sessionId: sessionId,
  };
  sendHit(payload);
};

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    // Only track on landing page
    if (pathname !== "/") {
      return;
    }

    // Avoid duplicate page views on the same URL
    if (lastTrackedUrl.current === pathname) {
      return;
    }

    lastTrackedUrl.current = pathname;
    const label = pathname === "/" ? "/" : pathname;
    const sessionId = getSessionId();
    const referrer = document.referrer || "Acesso Direto";

    const payload: AnalyticsPayload = {
      id: "global",
      type: "view",
      label: label,
      referrer: referrer,
      sessionId: sessionId,
    };

    sendHit(payload);
  }, [pathname]);

  return null;
}

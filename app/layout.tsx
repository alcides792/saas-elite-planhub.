import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kovr | Your smart subscription manager",
    template: "%s | Kovr"
  },
  description: "Manage your subscriptions, get renewal alerts and discover where you can save money every month. Never pay for services you don't use again.",
  keywords: ["subscription manager", "save money", "finance tracker", "subscription alerts", "cancel subscriptions"],
  authors: [{ name: "Kovr Team" }],
  creator: "Kovr AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kovr.space",
    title: "Kovr | Your smart subscription manager",
    description: "The intelligent way to manage and optimize your digital subscriptions.",
    siteName: "Kovr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kovr | Your smart subscription manager",
    description: "The intelligent way to manage and optimize your digital subscriptions.",
    creator: "@kovr_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kovr",
    "url": "https://kovr.space",
    "logo": "https://kovr.space/logo.png",
    "sameAs": [
      "https://twitter.com/kovr_ai",
      "https://github.com/kovr-ai"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={plusJakarta.className + " min-h-screen selection:bg-violet-500/30 overflow-x-hidden"}>
        <AnalyticsTracker />
        <GoogleAnalytics gaId="G-47GYF7Y7HB" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* CAMADA 1: Conteúdo da Aplicação */}
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

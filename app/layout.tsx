import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kovr | O teu gestor inteligente de assinaturas",
  description: "Gere as tuas subscrições, recebe alertas de renovação e descobre onde podes poupar dinheiro todos os meses. Nunca mais pagues por serviços que não usas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className + " min-h-screen selection:bg-violet-500/30 overflow-x-hidden"}>
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
          <Toaster position="bottom-right" theme="dark" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

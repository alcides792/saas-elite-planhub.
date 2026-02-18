import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kovr - Smart Subscription Manager",
  description: "Track, manage, and optimize your recurring expenses in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className + " min-h-screen selection:bg-violet-500/30 overflow-x-hidden"}>
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

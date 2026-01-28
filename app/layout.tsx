import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plan Hub - Stop wasting money on forgotten subscriptions",
  description: "The central hub for all your subscriptions and recurring plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className={plusJakarta.className + " min-h-screen selection:bg-violet-500/30 overflow-x-hidden"}>
        {/* CAMADA 1: Conteúdo da Aplicação */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

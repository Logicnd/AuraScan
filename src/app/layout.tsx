import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "AuraScan - Your AI's Conscience",
  description: "Mobile-first PWA that makes ethical AI addictive via gamification",
};

import { Navbar } from "@/components/layout/navbar";
import { LevelUpListener } from "@/components/gamification/level-up-listener";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, mono.variable, "min-h-screen bg-black font-sans antialiased selection:bg-green-500/30 flex flex-col")}>
        <LevelUpListener />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}

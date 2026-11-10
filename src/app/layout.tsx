import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import { StudyPet } from "@/components/pet/study-pet";
import { ServiceWorkerRegister } from "@/components/shared/sw-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Crazy Medic — Vismay Sharma",
  description: "Handwritten medical & biology study notes by Vismay Sharma.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#141A2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${caveat.variable}`}>
      <body className="antialiased min-h-screen selection:bg-[var(--coral)] selection:text-[var(--navy)]">
        {children}
        <StudyPet />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

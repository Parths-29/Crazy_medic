"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BookMarked, User } from "lucide-react";

function MobileNavContent() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Notes", href: "/notes", icon: BookOpen },
    { label: "My Library", href: "/library", icon: BookMarked },
    { label: "Account", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141E2C]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                isActive
                  ? "text-[#E8443A] font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E8443A] rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileNav() {
  return (
    <Suspense fallback={null}>
      <MobileNavContent />
    </Suspense>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-[#0F2B3C] text-white pt-12 pb-24 md:pb-12 mt-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-[#E8443A] flex items-center justify-center font-bold text-xs">
                +
              </div>
              <h3 className="font-display font-bold text-xl tracking-tight">The Crazy Medic</h3>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-3">Created with precision by Parth</p>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed mb-4">
              Making medical & biology concepts ridiculously visual and easy to remember. Tailored specifically for MBBS, NEET, Nursing and allied healthcare examinations.
            </p>
            <p className="text-xs text-amber-300/80 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-lg max-w-md">
              ⚠️ Medical Disclaimer: These notes are strictly for educational examination review and revision. They do not constitute clinical guidance, medical advice, diagnosis, or patient treatment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-200 mb-3 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-white transition">All Study Notes</Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-white transition">My Library (Purchased)</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Support & Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-200 mb-3 uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">Refund & Cancellation</Link>
              </li>
              <li>
                <span className="text-xs text-gray-500 block pt-2">Powered securely by Razorpay</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 The Crazy Medic (Parth). All rights reserved.</p>
          <p>Protected digital goods stamped with dynamic purchaser watermarks.</p>
        </div>
      </div>
    </footer>
  );
}


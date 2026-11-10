import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="theme-cream min-h-screen flex flex-col justify-between p-6 text-[var(--navy)]">
      <header className="max-w-md mx-auto w-full pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--navy)]/60 hover:text-[var(--coral)] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home Stage</span>
        </Link>
      </header>

      <div className="max-w-md mx-auto text-center py-12">
        <span className="font-mono text-xs text-[var(--coral)] uppercase tracking-widest block mb-2">
          Error 404
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--navy)] mb-3">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)] mb-6 leading-relaxed max-w-sm mx-auto">
          The page or study note you&apos;re searching for might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/notes"
          className="px-6 py-2.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs hover:bg-[var(--coral-hover)] transition shadow inline-block"
        >
          Browse All Notes →
        </Link>
      </div>

      <footer className="text-center text-[10px] text-[var(--ink-muted)] font-mono pb-2">
        The Crazy Medic • Parth
      </footer>
    </div>
  );
}


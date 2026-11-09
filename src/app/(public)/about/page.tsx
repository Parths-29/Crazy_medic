import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] pb-20">
      <header className="border-b border-[var(--border-light)] py-4 px-5 sm:px-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home Stage</span>
          </Link>
          <span className="font-serif font-bold text-sm text-[var(--navy)]">
            The Crazy Medic
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] block mb-2">
          About The Creator
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--coral)] mb-6">
          Vismay Sharma
        </h1>

        <div className="space-y-5 text-sm sm:text-base leading-relaxed text-[var(--navy)]/80">
          <p>
            Hi! I'm Vismay Sharma, the creator behind <strong>The Crazy Medic</strong>.
          </p>
          <p>
            Medical school is notorious for massive 800-page textbooks like Bailey & Love, Robbins, and Khurana. When exams hit, what you actually need isn't endless blocks of dense text—it's high-yield decision trees, memory hooks, and reproducible hand-drawn diagrams that you can sketch in a 10-mark university question.
          </p>
          <p>
            Every single page in these notebooks was illustrated by hand to ensure no fluff, no generic AI regurgitation, and 100% exam relevance.
          </p>
          <div className="pt-4 border-t border-[var(--border-light)]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-3 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs hover:bg-[var(--coral-hover)] transition shadow"
            >
              Follow @thecrazymedic on Instagram →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}


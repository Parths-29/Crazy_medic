import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";

export default async function LibraryPage() {
  const session = await auth();

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] pb-20">
      <header className="border-b border-[var(--border-light)] py-4 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home Stage</span>
          </Link>
          <span className="font-serif font-bold text-sm text-[var(--navy)]">
            My Study Library
          </span>
          <Link href="/notes" className="text-xs font-semibold text-[var(--coral)] hover:underline">
            Catalog →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-10 py-10">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--coral)] mb-1">
            My Purchased Notes
          </h1>
          <p className="text-xs text-[var(--ink-muted)] font-mono">
            Access verified to: {session?.user?.email || "Student Medico"}
          </p>
        </div>

        {/* Shelf Grid of Notebooks */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_NOTEBOOKS.slice(0, 1).map((nb) => (
            <div key={nb.id} className="flex flex-col group">
              <div
                className="w-full rounded-r-xl rounded-l-sm overflow-hidden notebook-shadow p-5 flex flex-col justify-between border border-black/10 relative"
                style={{
                  aspectRatio: "3 / 4",
                  backgroundColor: nb.coverTone || "var(--navy)",
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[10%] notebook-spine pointer-events-none" />
                <div className="pl-3">
                  <span className="text-[9px] font-mono uppercase text-[var(--coral)] block mb-1">
                    Unlocked
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
                    {nb.title}
                  </h3>
                </div>
                <div className="pl-3">
                  <span className="text-[10px] font-mono text-[var(--cream)]/60">
                    60 Pages • Read now
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[var(--navy)]">
                  {nb.title}
                </span>
                <Link
                  href={`/notes/${nb.slug}`}
                  className="text-xs font-semibold text-[var(--coral)] hover:underline flex items-center gap-0.5"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";
import { Container } from "@/components/ui/container";
import { Search, Lock } from "lucide-react";

const SUBJECTS = ["All", "Ophthalmology", "General Surgery", "Paediatrics", "Obstetrics & Gynae", "Otolaryngology"];

export default function NotesCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filtered = useMemo(() => {
    return MOCK_NOTEBOOKS.filter((nb) => {
      const matchSearch =
        nb.title.toLowerCase().includes(search.toLowerCase()) ||
        nb.subject.toLowerCase().includes(search.toLowerCase());
      const matchSubject = selectedSubject === "All" || nb.subject === selectedSubject;
      return matchSearch && matchSubject;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [search, selectedSubject, sortBy]);

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)]">
      {/* Top Bar using fluid Container */}
      <header className="border-b border-[var(--border-light)] py-4">
        <Container wide className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-full bg-[var(--navy)] text-[var(--cream)] flex items-center justify-center font-serif font-bold text-xs">
              CM
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base tracking-tight text-[var(--navy)] group-hover:text-[var(--coral)] transition">
                The Crazy Medic
              </span>
              <span className="text-xs text-[var(--ink-muted)] font-mono">by Vismay Sharma</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              Home
            </Link>
            <Link href="/stage" className="text-[var(--coral)] hover:underline font-bold transition">
              Notebook Stage
            </Link>
            <Link href="/library" className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              My Library
            </Link>
            <Link href="/login" className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              Login
            </Link>
          </nav>
        </Container>
      </header>

      {/* Main Content Area using Fluid Container */}
      <main className="py-10 sm:py-14">
        <Container>
          {/* Header row (title left, search and sort right on desktop; stacked on mobile) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-serif font-bold text-fluid-title text-[var(--coral)] tracking-tight mb-2">
                All Study Notes
              </h1>
              <p className="text-sm sm:text-base text-[var(--navy)]/80 max-w-xl leading-relaxed">
                Every notebook is hand-illustrated and structured for rapid recall in university prof exams.
              </p>
            </div>

            {/* Search and Sort on right */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)]" />
                <input
                  type="text"
                  placeholder="Search by topic or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-sm text-[var(--navy)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--coral)] shadow-sm"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-sm font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--coral)] shadow-sm cursor-pointer"
              >
                <option value="featured">Featured Notes</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Subject chips row */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-10 custom-scroll">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer border ${
                    isSelected
                      ? "bg-[var(--coral)] border-[var(--coral)] text-[var(--navy)] font-bold shadow-sm"
                      : "bg-transparent border-[var(--border-light)] text-[var(--navy)]/70 hover:border-[var(--navy)]/40"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Grid: repeat(auto-fill, minmax(clamp(200px, 18vw, 280px), 1fr)) */}
          {filtered.length > 0 ? (
            <div
              className="grid gap-6 sm:gap-8"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px, 18vw, 280px), 1fr))",
              }}
            >
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/notes/${item.slug}`}
                  className="group flex flex-col cursor-pointer focus:outline-none"
                >
                  {/* 3:4 Notebook Cover Card with soft shadow & spine edge */}
                  <div
                    className="relative w-full rounded-r-2xl rounded-l-md overflow-hidden notebook-shadow transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-1 flex flex-col justify-between p-5 sm:p-6 border border-black/10"
                    style={{
                      aspectRatio: "3 / 4",
                      backgroundColor: item.coverTone || "var(--navy)",
                    }}
                  >
                    {/* Subtle left spine indent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[10%] notebook-spine pointer-events-none border-r border-black/30" />

                    {/* Title on cover */}
                    <div className="pl-4 pt-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--coral)] block mb-1">
                        The Crazy Medic
                      </span>
                      <h3 className="font-serif font-bold text-base sm:text-lg lg:text-xl text-[var(--cream)] leading-snug line-clamp-3">
                        {item.title}
                      </h3>
                    </div>

                    {/* Page count at bottom */}
                    <div className="pl-4 pb-1">
                      <div className="w-10 h-[2.5px] bg-[var(--coral)] mb-2.5 rounded-full" />
                      <span className="text-xs font-mono text-[var(--cream)]/70">
                        {item.pageCount} Pages
                      </span>
                    </div>

                    {/* Subtle page stack on right edge */}
                    <div className="absolute right-0 top-2.5 bottom-2.5 w-2 page-stack opacity-80" />
                  </div>

                  {/* Below Cover Info: Title in serif navy, subject, price in coral */}
                  <div className="pt-3.5">
                    <span className="text-xs font-mono uppercase text-[var(--ink-muted)] block">
                      {item.subject}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[var(--navy)] group-hover:text-[var(--coral)] transition leading-snug line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-serif font-bold text-base text-[var(--coral)]">
                        ₹{item.price}
                      </span>
                      <span className="text-xs font-mono text-[var(--navy)]/50 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[var(--coral)]" />
                        PDF
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl bg-white border border-[var(--border-light)] max-w-md mx-auto">
              <h3 className="font-serif font-bold text-lg text-[var(--navy)] mb-1">No notes found</h3>
              <p className="text-sm text-[var(--ink-muted)]">Try selecting another subject or clearing your search.</p>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

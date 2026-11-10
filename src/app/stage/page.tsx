"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";
import { Coverflow } from "@/components/notebook/coverflow";
import { SheetDrawer } from "@/components/notebook/sheet-drawer";
import {
  Search,
  Menu,
  Share2,
  Bookmark,
  Info,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function StagePage() {
  const { data: session } = useSession();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<"details" | "buy" | "about" | "menu" | null>(null);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const currentItem = MOCK_NOTEBOOKS[selectedIndex] || MOCK_NOTEBOOKS[0];

  // Lock body scroll ONLY while on this stage, and restore cleanly on unmount
  useEffect(() => {
    document.body.classList.add("stage-locked");
    return () => {
      document.body.classList.remove("stage-locked");
    };
  }, []);

  // Keyboard navigation for coverflow (left/right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSheet || isOpen) return;
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => Math.min(MOCK_NOTEBOOKS.length - 1, prev + 1));
      } else if (e.key === "Enter") {
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSheet, isOpen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentItem.title} — The Crazy Medic`,
          text: `Check out ${currentItem.title} by Parth`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Notebook link copied!");
    }
  };

  const toggleWishlist = () => {
    setWishlisted((prev) => ({
      ...prev,
      [currentItem.id]: !prev[currentItem.id],
    }));
  };

  return (
    <main className="theme-navy fixed inset-0 w-screen h-[100dvh] flex flex-col justify-between overflow-hidden select-none px-4 sm:px-8 lg:px-12 py-2 sm:py-3.5 text-[var(--cream)] relative">
      {/* Big minimal typographic element across viewport behind the notebook */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
      >
        <span
          className="font-serif font-black text-[14vw] leading-none text-[var(--coral)] opacity-[0.14] whitespace-nowrap tracking-tight transition-all duration-700 transform"
          style={{
            transform: `translateX(${(selectedIndex - 2) * -50}px)`,
          }}
        >
          {currentItem.title.toUpperCase()}
        </span>
      </div>

      {/* 1. TOP BAR (Full width with proper side padding) */}
      <header className="w-full flex items-center justify-between z-40 relative">
        {/* Brand circle mark & Return to Intro */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Return to intro page"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-sm font-serif font-bold text-[var(--coral)] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setActiveSheet("about")}
            className="text-left hidden sm:block cursor-pointer hover:opacity-80 transition"
          >
            <span className="font-serif font-bold text-sm block leading-none">The Crazy Medic</span>
            <span className="text-[10px] text-[var(--cream)]/60 font-mono">by Parth</span>
          </button>
        </div>

        {/* Small round icon buttons (Right edge: User, Search, Menu) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {session?.user && (
            <Link
              href="/profile"
              title={`Signed in as ${session.user.name || session.user.email}`}
              className="h-10 sm:h-11 px-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center gap-2 text-xs font-bold text-[var(--cream)] transition"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--coral)] text-[var(--navy)] flex items-center justify-center font-serif font-black text-[11px]">
                {(session.user.name || session.user.email || "M").charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline max-w-[90px] truncate">
                {session.user.name?.split(" ")[0] || "Account"}
              </span>
            </Link>
          )}

          <Link
            href="/notes"
            aria-label="Search catalog"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[var(--cream)]/80 hover:text-[var(--cream)] transition"
          >
            <Search className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setActiveSheet("menu")}
            aria-label="Open menu"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[var(--cream)]/80 hover:text-[var(--cream)] transition cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. CENTER STAGE (3D Hardcover Coverflow Carousel) */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full my-auto z-10">
        <Coverflow
          items={MOCK_NOTEBOOKS}
          selectedIndex={selectedIndex}
          onSelectIndex={(idx: number) => setSelectedIndex(idx)}
          isOpen={isOpen}
          onOpenNotebook={() => setIsOpen(true)}
          onCloseNotebook={() => setIsOpen(false)}
          onBuy={() => setActiveSheet("buy")}
        />

        {/* Desktop left/right quick arrow pills */}
        <button
          onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
          disabled={selectedIndex === 0}
          aria-label="Previous notebook"
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-[var(--cream)]/60 hover:text-[var(--cream)] disabled:opacity-20 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setSelectedIndex((prev) => Math.min(MOCK_NOTEBOOKS.length - 1, prev + 1))}
          disabled={selectedIndex === MOCK_NOTEBOOKS.length - 1}
          aria-label="Next notebook"
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-[var(--cream)]/60 hover:text-[var(--cream)] disabled:opacity-20 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3. UNDER THE NOTEBOOK (Delicate, quiet label so notebook is the hero) */}
      <footer className="w-full flex flex-col items-center justify-center space-y-1.5 z-40 relative pb-2 sm:pb-3">
        {/* Compact Title & metadata row */}
        <div className="text-center space-y-0.5 max-w-md px-4">
          <h2 className="font-serif font-medium text-sm sm:text-base text-[var(--cream)] tracking-normal leading-tight transition-all duration-300 line-clamp-1">
            {currentItem.title}
          </h2>

          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-mono text-[var(--cream)]/60">
            <Lock className="w-3 h-3 text-[var(--coral)]/80" />
            <span>
              {currentItem.pageCount} pages • {currentItem.subject}
            </span>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-2 sm:gap-2.5 pt-0.5">
          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Share notebook"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[var(--cream)]/70 hover:text-[var(--cream)] transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            aria-label="Save to wishlist"
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-white/10 flex items-center justify-center transition cursor-pointer ${
              wishlisted[currentItem.id]
                ? "bg-[var(--coral)] text-[var(--navy)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--cream)]/70 hover:text-[var(--cream)]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${wishlisted[currentItem.id] ? "fill-current" : ""}`} />
          </button>

          {/* Details */}
          <button
            onClick={() => setActiveSheet("details")}
            aria-label="View chapter outline & specs"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[var(--cream)]/70 hover:text-[var(--cream)] transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Primary Buy Action Button showing Price */}
          <button
            onClick={() => setActiveSheet("buy")}
            className="h-8 sm:h-8.5 px-4 sm:px-5 rounded-full bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] font-bold text-xs tracking-wide transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Buy ₹{currentItem.price}</span>
          </button>
        </div>

        {/* Minimal dot pagination index */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {MOCK_NOTEBOOKS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Jump to notebook ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === idx ? "w-4 bg-[var(--coral)]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </footer>

      {/* Slide-in Sheet Drawer */}
      <SheetDrawer
        type={activeSheet}
        item={currentItem}
        onClose={() => setActiveSheet(null)}
        onOpenBuy={() => setActiveSheet("buy")}
      />
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";
import { 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { InstagramIcon } from "@/components/shared/instagram-icon";

interface IntroPageClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
  initialTransition?: boolean;
}

export function IntroPageClient({ user: serverUser, initialTransition = false }: IntroPageClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user || serverUser;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(initialTransition);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const newestNote = MOCK_NOTEBOOKS[0];
  const subjects = Array.from(new Set(MOCK_NOTEBOOKS.map((n) => n.subject.toUpperCase())));
  const featuredNotes = MOCK_NOTEBOOKS.slice(0, 4);

  // Verified reviews (only real reviews, max 3)
  const verifiedReviews = (newestNote.testimonials || []).slice(0, 3);

  // Signature Transition trigger to /stage
  const handleOpenStage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      router.push("/stage");
      return;
    }

    setIsTransitioning(true);
    // Navigate cleanly under 900ms
    setTimeout(() => {
      router.push("/stage");
    }, 650);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] overflow-x-hidden selection:bg-[var(--coral)] selection:text-[var(--navy)] relative">
      
      {/* ================= SIGNATURE TRANSITION OVERLAY ================= */}
      <AnimatePresence>
        {(isTransitioning || initialTransition) && (
          <motion.div
            initial={initialTransition ? { clipPath: "circle(60% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[var(--navy)] flex flex-col items-center justify-center text-[var(--cream)] p-6"
          >
            <motion.div
              initial={initialTransition ? { scale: 1.05, rotateY: -15 } : { scale: 0.8, rotateY: 0 }}
              animate={{ scale: 1.15, rotateY: -25 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-56 sm:w-72 aspect-[3/4] rounded-r-2xl bg-[var(--navy-2)] border-2 border-white/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--coral)] text-[var(--navy)] font-serif font-black flex items-center justify-center text-sm">
                CM
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral)] block">
                  Opening Notebook Stage
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[var(--cream)] mt-1">
                  {newestNote.title}
                </h3>
              </div>
            </motion.div>
            <span className="mt-6 text-xs font-mono text-[var(--cream)]/60 animate-pulse">
              Entering Notebook Stage...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. HEADER ================= */}
      <header className="w-full border-b-2 border-[var(--navy)] bg-[#F5EEDF] sticky top-0 z-40">
        <Container wide className="py-3.5 flex items-center justify-between">
          {/* Brand Mark and Name Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-none bg-[var(--navy)] text-[var(--cream)] border-2 border-[var(--navy)] flex items-center justify-center font-serif font-black text-sm shadow-[3px_3px_0_var(--coral)] group-hover:shadow-[1px_1px_0_var(--coral)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition">
              CM
            </div>
            <div>
              <span className="font-serif font-black text-base sm:text-lg text-[var(--navy)] leading-tight block tracking-tight">
                The Crazy Medic
              </span>
              <span className="text-[11px] font-sans text-[var(--navy)]/70 block -mt-0.5 font-bold">
                by Vismay Sharma
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links & Chunky Login/Profile Button */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[var(--navy)]">
            <Link href="/notes" className="hover:text-[var(--coral)] transition">
              Notes
            </Link>
            <button
              onClick={handleOpenStage}
              className="hover:text-[var(--coral)] transition cursor-pointer"
            >
              Stage
            </button>
            <Link href="/about" className="hover:text-[var(--coral)] transition">
              About
            </Link>
            <Link href="/library" className="hover:text-[var(--coral)] transition">
              Library
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="px-3.5 py-2 border-2 border-[var(--navy)] bg-white text-[var(--navy)] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_var(--navy)] hover:shadow-[1px_1px_0_var(--navy)] hover:translate-x-[2px] hover:translate-y-[2px] transition"
                >
                  {firstName || "Profile"}
                </Link>
                <Link
                  href="/library"
                  className="px-4 py-2 border-2 border-[var(--navy)] bg-[var(--coral)] text-[var(--navy)] font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0_var(--navy)] hover:shadow-[2px_2px_0_var(--navy)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition"
                >
                  My Library
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 border-2 border-[var(--navy)] bg-white text-[var(--navy)] font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0_var(--navy)] hover:shadow-[2px_2px_0_var(--navy)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="md:hidden p-2 border-2 border-[var(--navy)] bg-white shadow-[3px_3px_0_var(--navy)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[var(--navy)]" />
          </button>
        </Container>
      </header>

      {/* ================= FULL SCREEN MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[var(--navy)] text-[var(--cream)] p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
              <span className="font-serif font-black text-xl text-[var(--cream)]">
                The Crazy Medic
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 border-2 border-white/20 text-[var(--cream)] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 font-serif font-black text-3xl sm:text-4xl text-[var(--cream)] py-8">
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleOpenStage(e);
                }}
                className="text-left text-[var(--coral)] hover:underline cursor-pointer"
              >
                Open Notebook Stage →
              </button>
              <Link
                href="/notes"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--coral)] transition"
              >
                All Notes Catalog
              </Link>
              <Link
                href="/library"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--coral)] transition"
              >
                My Library
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--coral)] transition"
              >
                About Vismay
              </Link>
              <Link
                href={user ? "/profile" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--coral)] transition"
              >
                {user ? "Student Profile" : "Account Login"}
              </Link>
            </div>

            <div className="pt-4 border-t-2 border-white/20 text-xs font-mono text-[var(--cream)]/60 flex items-center justify-between">
              <span>by Vismay Sharma</span>
              <span>© The Crazy Medic</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="min-h-[85dvh] sm:min-h-[88dvh] flex items-center py-10 sm:py-16 border-b-2 border-[var(--navy)] relative overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Neo-Brutalist Giant Typography */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Giant Headline */}
              <div>
                {user && firstName ? (
                  <h1 className="leading-tight tracking-tight">
                    <span className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[var(--navy)] block">
                      Welcome back,
                    </span>
                    <span className="font-serif font-black text-5xl sm:text-7xl lg:text-8xl text-[var(--coral-ink)] block mt-1">
                      {firstName}.
                    </span>
                  </h1>
                ) : (
                  <h1 className="leading-none tracking-tight">
                    <span className="font-serif font-black text-5xl sm:text-7xl lg:text-8xl text-[var(--navy)] block">
                      Hi, I&apos;m
                    </span>
                    <span className="font-serif font-black text-6xl sm:text-8xl lg:text-9xl text-[var(--coral-ink)] block mt-1">
                      Vismay.
                    </span>
                  </h1>
                )}
              </div>

              {/* One-Line Promise (Editable placeholder from Admin Settings) */}
              <div className="space-y-1">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--navy)] leading-snug max-w-xl">
                  Handwritten medical notes, made for fast revision.
                </p>
                <span className="text-[11px] font-mono text-[var(--navy)]/40 block">
                  [Admin: editable hero statement]
                </span>
              </div>

              {/* Interactive Action Buttons with Tactile Hard Shadow */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
                {user ? (
                  <>
                    <button
                      onClick={handleOpenStage}
                      className="btn-neo-primary text-base sm:text-lg w-full sm:w-auto"
                    >
                      <span>Continue reading →</span>
                    </button>
                    <Link
                      href="/library"
                      className="btn-neo-secondary text-base sm:text-lg w-full sm:w-auto text-center"
                    >
                      Open my library
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleOpenStage}
                      className="btn-neo-primary text-base sm:text-lg w-full sm:w-auto"
                    >
                      <span>Open the notebook →</span>
                    </button>
                    <Link
                      href="/notes"
                      className="btn-neo-secondary text-base sm:text-lg w-full sm:w-auto text-center"
                    >
                      Browse all notes
                    </Link>
                  </>
                )}
              </div>

              {/* Honest Trust Lines */}
              <div className="pt-2 space-y-1.5 text-xs sm:text-sm font-bold text-[var(--navy)]/80">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--coral-ink)] font-black">✓</span>
                  <span>Read inside the site, no downloads. Your name stamped on every page.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--coral-ink)] font-black">✓</span>
                  <span>Pay with UPI, instant access.</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Navy Panel with Tilted Closed Notebook */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
              
              {/* Handwritten annotation with arrow */}
              <div className="absolute -top-6 lg:-top-10 left-4 sm:left-12 z-20 flex items-center gap-2 font-handwriting text-2xl sm:text-3xl text-[var(--coral-ink)] rotate-[-6deg] select-none pointer-events-none">
                <span>start here</span>
                <span className="text-3xl sm:text-4xl">⤵</span>
              </div>

              {/* Tilted Neo-Brutalist Navy Panel */}
              <div
                onClick={handleOpenStage}
                className="w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[380px] aspect-[3/4] bg-[var(--navy)] border-[3px] border-[var(--navy)] p-5 sm:p-7 flex flex-col justify-between shadow-[6px_6px_0_var(--navy)] sm:shadow-[8px_8px_0_var(--navy)] rotate-[-2deg] sm:rotate-[-3deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative group text-[var(--cream)]"
              >
                {/* Tilted Coral Sticker Tag */}
                <div className="absolute -top-3 -right-3 z-30 px-3 py-1 bg-[var(--coral)] text-[var(--navy)] border-2 border-[var(--navy)] font-mono font-black text-xs uppercase tracking-wider rotate-[4deg] shadow-[3px_3px_0_var(--navy)]">
                  New: {newestNote.title}
                </div>

                {/* Top of Book Panel */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="w-9 h-9 bg-[var(--coral)] text-[var(--navy)] font-serif font-black flex items-center justify-center text-xs">
                    CM
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--cream)]/60">
                    60 Pages • {newestNote.subject}
                  </span>
                </div>

                {/* Notebook Visual Cover */}
                <div className="my-auto py-6 text-center space-y-3">
                  <span className="text-[11px] font-mono tracking-widest text-[var(--coral)] uppercase block">
                    Exam-Focused Edition
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-[var(--cream)] leading-tight group-hover:text-[var(--coral)] transition">
                    {newestNote.title}
                  </h3>
                  <p className="text-xs text-[var(--cream)]/70 font-sans line-clamp-2 px-2">
                    {newestNote.tagline}
                  </p>
                </div>

                {/* Bottom of Book Panel */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--cream)]/60">
                    Tap to open stage
                  </span>
                  <span className="font-serif font-black text-lg text-[var(--coral)]">
                    ₹{newestNote.price}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* ================= 3. MARQUEE BAND ================= */}
      {subjects.length >= 3 && (
        <section className="bg-[var(--navy)] text-[var(--cream)] py-3.5 border-b-2 border-[var(--navy)] overflow-hidden select-none">
          <div className="animate-marquee font-serif font-black text-base sm:text-lg tracking-widest uppercase flex items-center gap-6 whitespace-nowrap">
            {/* Duplicated for seamless loop */}
            {subjects.concat(subjects).concat(subjects).map((subj, idx) => (
              <span key={idx} className="flex items-center gap-6">
                <span>{subj}</span>
                <span className="text-[var(--coral)] font-bold text-xl leading-none">*</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ================= 4. HOW IT WORKS ================= */}
      <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)]">
        <Container>
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
              Clear & Simple
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="divide-y-2 divide-[var(--navy)] border-y-2 border-[var(--navy)]">
            {/* Row 01 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3">
                <span className="font-serif font-black text-5xl sm:text-7xl text-[var(--coral-ink)] leading-none block">
                  01
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[var(--navy)] mb-2">
                  Pick a notebook.
                </h3>
                <p className="text-base sm:text-lg text-[var(--navy)]/80 leading-relaxed max-w-2xl">
                  Browse handwritten summaries built specifically for university prof exams. Every page is focused on questions examiners love to ask.
                </p>
              </div>
            </div>

            {/* Row 02 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3">
                <span className="font-serif font-black text-5xl sm:text-7xl text-[var(--coral-ink)] leading-none block">
                  02
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[var(--navy)] mb-2">
                  Pay with UPI, card or net banking.
                </h3>
                <p className="text-base sm:text-lg text-[var(--navy)]/80 leading-relaxed max-w-2xl">
                  Instant automated order verification. Zero waiting periods or manual email confirmations.
                </p>
              </div>
            </div>

            {/* Row 03 */}
            <div className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-3">
                <span className="font-serif font-black text-5xl sm:text-7xl text-[var(--coral-ink)] leading-none block">
                  03
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[var(--navy)] mb-2">
                  Read it inside the site, on up to 2 devices.
                </h3>
                <p className="text-base sm:text-lg text-[var(--navy)]/80 leading-relaxed max-w-2xl">
                  Stamped with your student name and contact across every page to prevent leaks. Available offline in our private viewer on your phone, tablet or laptop.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= 5. A REAL PAGE LOOKS LIKE THIS ================= */}
      <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)] bg-[#EADFC9]/40">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
                Authentic Sample
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
                A real page looks like this.
              </h2>
            </div>

            <button
              onClick={handleOpenStage}
              className="btn-neo-secondary text-sm"
            >
              Flip through sample in stage →
            </button>
          </div>

          {/* Thick bordered real sample preview frame */}
          <div className="relative border-[3px] border-[var(--navy)] bg-white p-6 sm:p-10 shadow-[8px_8px_0_var(--navy)] max-w-4xl mx-auto">
            
            {/* Handwriting sticker caption */}
            <div className="absolute -top-5 right-6 z-20 font-handwriting text-2xl sm:text-3xl text-[var(--coral-ink)] bg-white px-3 py-1 border-2 border-[var(--navy)] rotate-[2deg] shadow-[3px_3px_0_var(--navy)]">
              this is a real page ✎
            </div>

            {/* Simulated High-Res Handwritten Page Layout */}
            <div className="border border-[#E2D8C3] p-6 sm:p-8 rounded-none bg-[#FCFAF6] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[var(--navy)] pb-3">
                <span className="font-serif font-black text-lg sm:text-xl text-[var(--navy)]">
                  CORNEAL ULCER (KERATITIS) — EXAM ESSENTIALS
                </span>
                <span className="font-mono text-xs font-bold text-[var(--coral-ink)] uppercase">
                  Page 14
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-[var(--navy)]">
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-[var(--coral-ink)]">
                    1. Bacterial vs Fungal Differentials
                  </h4>
                  <p>
                    • <strong>Bacterial:</strong> Rapid onset, circumciliary congestion, thick hypopyon (mobile level), responsive to fortified Cefazolin (5%) + Tobramycin.
                  </p>
                  <p>
                    • <strong>Fungal (Aspergillus/Fusarium):</strong> History of trauma with vegetative matter (tree branch, dust). Dry slough, feathery margins, satellite lesions, immune ring of Wessely.
                  </p>
                </div>

                <div className="p-4 border-2 border-[var(--navy)] bg-[var(--cream)]/60 space-y-2">
                  <h4 className="font-bold text-sm text-[var(--navy)] uppercase font-mono">
                    ⚠️ Golden Rule For University Viva:
                  </h4>
                  <p className="text-xs sm:text-sm font-medium">
                    Never prescribe topical corticosteroids in suspected fungal or active dendritic viral ulcers. It leads to rapid corneal perforation!
                  </p>
                </div>
              </div>

              {/* Watermark note */}
              <div className="pt-3 border-t border-[#E2D8C3] text-center text-xs font-mono text-[var(--navy)]/50">
                Encrypted Watermark Stamped: [Buyer Name + Phone (+91) + Order ID]
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= 6. FEATURED NOTEBOOKS ================= */}
      <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
                Storefront
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
                Featured Notebooks
              </h2>
            </div>

            <Link href="/notes" className="btn-neo-secondary text-sm">
              See all notes →
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNotes.map((note) => (
              <div
                key={note.id}
                className="border-2 border-[var(--navy)] bg-white p-5 flex flex-col justify-between shadow-[6px_6px_0_var(--navy)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--navy)] transition group"
              >
                <div>
                  <div className="aspect-[3/4] bg-[var(--navy)] border border-[var(--navy)] p-4 flex flex-col justify-between text-[var(--cream)] mb-4 relative">
                    <span className="text-[10px] font-mono text-[var(--coral)] uppercase">
                      {note.subject}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[var(--cream)] leading-snug">
                      {note.title}
                    </h4>
                    <span className="text-[11px] font-mono text-[var(--cream)]/60">
                      {note.pageCount} Pages
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg text-[var(--navy)] group-hover:text-[var(--coral-ink)] transition line-clamp-1">
                    {note.title}
                  </h3>

                  <div className="font-serif font-black text-xl text-[var(--coral-ink)] my-1.5">
                    ₹{note.price}
                  </div>

                  <p className="text-xs text-[var(--navy)]/70 line-clamp-2 leading-relaxed">
                    {note.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--navy)]/20 flex items-center justify-between">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="text-xs font-bold text-[var(--navy)] hover:text-[var(--coral-ink)] flex items-center gap-1"
                  >
                    <span>View note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleOpenStage}
                    className="text-xs font-mono text-[var(--navy)]/60 hover:text-[var(--navy)] underline cursor-pointer"
                  >
                    Open in stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= 7. ABOUT VISMAY ================= */}
      <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)] bg-[#EADFC9]/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Photo Frame (Neutral placeholder, no fake claims) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-square border-[3px] border-[var(--navy)] bg-white p-4 shadow-[8px_8px_0_var(--navy)] relative">
                <div className="w-full h-full bg-[var(--navy-2)] border border-[var(--navy)] flex flex-col items-center justify-center p-6 text-center text-[var(--cream)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--coral)] text-[var(--navy)] font-serif font-black text-2xl flex items-center justify-center mb-3">
                    VS
                  </div>
                  <span className="font-serif font-bold text-lg">Vismay Sharma</span>
                  <span className="text-xs font-mono text-[var(--coral)] mt-1">Creator & Editor</span>
                  <span className="text-[11px] font-mono text-[var(--cream)]/40 mt-3">
                    [Photo uploaded via Admin &gt; Settings]
                  </span>
                </div>
              </div>
            </div>

            {/* Right Bio Information */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
                  The Story
                </span>
                <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
                  About Vismay
                </h2>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-[var(--navy)]/85 leading-relaxed">
                <p>
                  &ldquo;The Crazy Medic&rdquo; was born out of frustration with 800-page medical textbooks before professional examinations.
                </p>
                <p>
                  These notes distill complex clinical classifications, surgical steps, and high-yield criteria into concise, memorable handwritten one-pagers.
                </p>
                <div className="p-3 bg-white border-2 border-[var(--navy)] text-xs font-mono text-[var(--navy)]/60">
                  Note: Add Vismay&apos;s full background and story in Admin &gt; Settings.
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-neo-secondary text-sm"
                >
                  <InstagramIcon className="w-4 h-4 text-[var(--coral-ink)]" />
                  <span>Instagram @thecrazymedic</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ================= 8. VERIFIED REVIEWS ================= */}
      {verifiedReviews.length > 0 && (
        <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)]">
          <Container>
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
                Real Medical Students
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
                Verified Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verifiedReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="border-2 border-[var(--navy)] bg-white p-6 shadow-[6px_6px_0_var(--navy)] flex flex-col justify-between"
                >
                  <p className="font-serif text-lg text-[var(--navy)] leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="pt-4 border-t-2 border-[var(--navy)]/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[var(--navy)] block">{rev.name}</span>
                      <span className="text-[11px] font-mono text-[var(--coral-ink)]">Verified Buyer</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--navy)]/50">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ================= 9. FAQ ACCORDION ================= */}
      <section className="py-16 sm:py-24 border-b-2 border-[var(--navy)]">
        <Container>
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral-ink)] font-black block mb-1">
              Common Questions
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-[var(--navy)] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl divide-y-2 divide-[var(--navy)] border-y-2 border-[var(--navy)]">
            {[
              {
                q: "Can I download the PDF?",
                a: "No. You read your notes directly inside the site's private viewer. Every page is stamped dynamically with your student name and phone number to protect against leaks.",
              },
              {
                q: "How do I get access after paying?",
                a: "Instantly. Once your UPI or card payment clears, the note appears immediately in 'My Library' and a receipt is sent to your email.",
              },
              {
                q: "Can I read on my phone?",
                a: "Yes. The private viewer is designed mobile-first, and scales perfectly on phones, iPads, Android tablets, and laptops.",
              },
              {
                q: "How many devices can I use?",
                a: "Up to 2 active devices per student account. You can manage or revoke devices from your account profile.",
              },
              {
                q: "What if something goes wrong?",
                a: "You can reach us through our Contact page or review our Refund Policy. All purchase queries are resolved promptly.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-serif font-black text-lg sm:text-xl text-[var(--navy)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[var(--coral-ink)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--navy)] shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm sm:text-base text-[var(--navy)]/80 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= 10. FINAL CTA BAND & FOOTER ================= */}
      <section className="bg-[var(--navy)] text-[var(--cream)] py-16 sm:py-24 border-b-2 border-[var(--navy)]">
        <Container>
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="font-serif font-black text-4xl sm:text-6xl text-[var(--cream)] tracking-tight">
              Ready when you are.
            </h2>
            <p className="text-base sm:text-lg text-[var(--cream)]/75">
              Open the 3D notebook stage to browse and sample our entire handwritten medical collection.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenStage}
                className="btn-neo-primary text-base sm:text-lg"
              >
                <span>Open the notebook →</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5EEDF] py-10 border-t-2 border-[var(--navy)] text-xs text-[var(--navy)]/70">
        <Container wide className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>
            <span className="font-bold text-[var(--navy)]">The Crazy Medic</span> • by Vismay Sharma
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <Link href="/terms" className="hover:text-[var(--navy)]">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--navy)]">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-[var(--navy)]">Refund Policy</Link>
            <Link href="/contact" className="hover:text-[var(--navy)]">Contact</Link>
          </div>

          <div className="text-[11px] text-[var(--navy)]/50">
            Educational study notes only. Not medical advice.
          </div>
        </Container>
      </footer>

    </div>
  );
}

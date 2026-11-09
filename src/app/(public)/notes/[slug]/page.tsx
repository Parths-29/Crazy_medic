"use client";

import React, { useState, Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_NOTEBOOKS, NotebookItem } from "@/components/notebook/notebook-data";
import { Notebook } from "@/components/notebook/notebook";
import { Container } from "@/components/ui/container";
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Check, 
  Copy, 
  CheckCheck, 
  Star, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Eye,
  X
} from "lucide-react";

import { UpiPaymentCard } from "@/components/ui/upi-payment-card";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[var(--ink-muted)]">Loading notebook...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const item = MOCK_NOTEBOOKS.find((n) => n.slug === slug);

  if (!item) {
    return notFound();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isPaidDemo, setIsPaidDemo] = useState(false);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;
    setIsPaidDemo(true);
  };

  const otherProducts = MOCK_NOTEBOOKS.filter((n) => n.id !== item.id);

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] pb-28 lg:pb-16 bg-[#F5EEDF]">
      {/* Top Creator Bar matching Reference Header */}
      <header className="border-b border-[#E2D8C3] bg-white/70 backdrop-blur-sm sticky top-0 z-30 py-3.5">
        <Container wide className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/notes" className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--navy)] text-[var(--cream)] flex items-center justify-center font-serif font-bold text-xs shadow-sm">
                VM
              </div>
              <div>
                <span className="font-serif font-bold text-sm sm:text-base text-[var(--navy)] leading-none block">
                  The Crazy Medic
                </span>
                <span className="text-[11px] text-[var(--navy)]/60 font-sans block mt-0.5">
                  by Vismay Sharma
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <Link 
              href="/stage" 
              className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition"
            >
              Stage
            </Link>
            <Link 
              href="/notes" 
              className="text-[var(--navy)]/80 hover:text-[var(--coral)] transition flex items-center gap-1.5"
            >
              <span>All Notes</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </header>

      {/* Main 2-Column Responsive Body */}
      <main className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ================= LEFT COLUMN: HERO, ABOUT, DEMO PICS, REVIEWS, OTHER PRODUCTS ================= */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-10">
              
              {/* 1. Main Cover / 3D Stage Section */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 sm:p-8 shadow-sm">
                <div className="inline-block px-3 py-1 rounded-md bg-[var(--navy)] text-[var(--cream)] text-xs font-mono tracking-wide uppercase mb-4">
                  Final Year MBBS University Exam
                </div>

                <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[var(--navy)] leading-tight tracking-tight mb-2">
                  {item.title}
                </h1>

                <p className="text-xs sm:text-sm text-[var(--coral)] font-bold uppercase tracking-wider mb-6">
                  {item.tagline}
                </p>

                {/* 3D Interactive Notebook Viewer */}
                <div className="py-4 flex flex-col items-center justify-center bg-[var(--navy)] rounded-2xl p-6 sm:p-8 text-[var(--cream)] relative overflow-hidden">
                  <div className="absolute top-3 left-4 text-[11px] font-mono text-[var(--cream)]/60 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Digital Interactive Sample</span>
                  </div>

                  <div className="my-4">
                    <Notebook
                      item={item}
                      isOpen={isOpen}
                      onOpen={() => setIsOpen(true)}
                      onClose={() => setIsOpen(false)}
                      onBuy={() => setIsBuyModalOpen(true)}
                    />
                  </div>

                  <div className="text-center mt-2">
                    <span className="text-xs text-[var(--cream)]/75 font-mono">
                      {isOpen ? "Flipping through sample excerpts" : "Tap cover to open 3D spread preview"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. ABOUT THE PAGE SECTION */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--navy)]/50 block mb-1">
                    About The Page
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[var(--navy)]">
                    Exam-Focused Handwritten Notes
                  </h2>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-[var(--navy)]/85 leading-relaxed">
                  <p className="font-semibold text-[var(--navy)]">
                    FINAL YEAR MBBS STUDENTS, YOUR {item.subject.toUpperCase()} REVISION JUST GOT EASIER!
                  </p>
                  <p>
                    STOP JUGGLING BETWEEN MULTIPLE PDFs AND ENDLESS TEXTBOOK PAGES!
                  </p>
                  <p>
                    Introducing <span className="font-bold text-[var(--coral)]">{item.pageCount} PAGES OF {item.subject.toUpperCase()} HANDWRITTEN NOTES</span> — designed to make your university exam preparation more organised and revision-friendly. ❤️
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#F5EEDF] border border-[#E2D8C3] font-mono text-xs sm:text-sm font-bold text-[var(--navy)]">
                    {item.chapters.length} CHAPTERS. ONE COMPLETE PDF.
                  </div>
                </div>

                {/* Chapter Checklist */}
                <div>
                  <h3 className="font-serif font-bold text-base text-[var(--navy)] mb-3.5">
                    What's Inside?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.chapters.map((ch, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--navy)]/90">
                        <Check className="w-4 h-4 text-[var(--coral)] shrink-0 mt-0.5" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. FEW DEMO PICS! ACTUAL PDF CONTAINING 60+ PAGES */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--navy)]/50 block">
                      Preview Samples
                    </span>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-[var(--navy)]">
                      Few Demo Pics! Actual PDF Containing {item.pageCount}+ Pages
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--coral)] font-bold">
                    Clean Stamped Previews
                  </span>
                </div>

                {/* Grid of demo cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(item.demoPages || []).map((demo) => (
                    <div 
                      key={demo.id}
                      onClick={() => setActivePreview(demo.title)}
                      className="group cursor-pointer rounded-xl border border-[#E2D8C3] bg-[#F5EEDF]/50 hover:bg-[#F5EEDF] p-4 transition shadow-sm hover:border-[var(--coral)]"
                    >
                      <div className="aspect-[4/3] rounded-lg bg-white border border-[#E2D8C3] p-4 flex flex-col justify-between relative overflow-hidden mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--coral)] text-white font-bold">
                            {demo.badge}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--navy)]/50">
                            Page {demo.pageNumber}
                          </span>
                        </div>
                        <div className="text-center py-2">
                          <h4 className="font-serif font-bold text-sm text-[var(--navy)] group-hover:text-[var(--coral)] transition">
                            {demo.title}
                          </h4>
                          <p className="text-[11px] text-[var(--navy)]/70 mt-1 line-clamp-2">
                            {demo.highlight}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--coral)]">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tap to inspect diagram</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[var(--navy)] block text-center">
                        {demo.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TESTIMONIALS SECTION */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 sm:p-8 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--navy)]/50 block mb-1">
                    Verified Feedback
                  </span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[var(--navy)]">
                    Testimonials
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(item.testimonials || [
                    { name: "Rohit", rating: 5, comment: "Best notes for university exams. Waiting for Surgery 🙏🙏", avatarSeed: "R" },
                    { name: "Kashifa", rating: 5, comment: "Loved the handwritten notes Bhaiya ❤️ 😇", avatarSeed: "K" },
                    { name: "Rakesh Yadav", rating: 5, comment: "Bhai same aisa notes Medicine ki upload karo 🙏 🥺", avatarSeed: "RY" },
                    { name: "Inaya", rating: 5, comment: "Perfect for last time revision 😇 😇", avatarSeed: "I" }
                  ]).map((t, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#E2D8C3] bg-[#F5EEDF]/30 space-y-2.5">
                      <div className="flex items-center gap-1 text-[#FFB800]">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--navy)]/90 font-medium">
                        "{t.comment}"
                      </p>
                      <div className="flex items-center gap-2 pt-1 border-t border-[#E2D8C3]/50">
                        <div className="w-6 h-6 rounded-full bg-[var(--navy)] text-[var(--cream)] text-[10px] font-bold flex items-center justify-center">
                          {t.avatarSeed}
                        </div>
                        <span className="text-xs font-semibold text-[var(--navy)]">
                          {t.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Already made a payment on this page? Sign in banner */}
              <div className="p-4 rounded-xl bg-white border border-[#E2D8C3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
                <span className="text-[var(--navy)]/80 font-medium text-center sm:text-left">
                  Already made a payment on this page?
                </span>
                <Link 
                  href="/login" 
                  className="font-bold text-[var(--coral)] hover:underline flex items-center gap-1"
                >
                  <span>Sign in to view details & library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 6. CHECK OUT MY OTHER PRODUCTS SECTION */}
              <div className="space-y-4">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[var(--navy)]">
                  Check Out My Other Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherProducts.map((other) => (
                    <Link
                      key={other.id}
                      href={`/notes/${other.slug}`}
                      className="group bg-white p-5 rounded-2xl border border-[#E2D8C3] hover:border-[var(--coral)] transition shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-base text-[var(--navy)] group-hover:text-[var(--coral)] transition line-clamp-1">
                          {other.title}
                        </h4>
                        <div className="text-sm font-bold text-[var(--coral)] my-1.5">
                          ₹{other.price}
                        </div>
                        <p className="text-xs text-[var(--navy)]/70 line-clamp-2 leading-relaxed">
                          {other.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E2D8C3] flex items-center justify-between text-xs font-semibold text-[var(--navy)]/70 group-hover:text-[var(--coral)]">
                        <span>View payment page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= RIGHT COLUMN: STICKY CHECKOUT CARD (SuperProfile Style) ================= */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-4">
              
              {/* Checkout Form Card */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 sm:p-7 shadow-lg">
                <div className="text-xs text-[var(--navy)]/70 font-sans mb-4">
                  Access to this purchase will be sent to this email
                </div>

                {isPaidDemo ? (
                  <div className="space-y-3">
                    <UpiPaymentCard
                      amount={item.price}
                      noteTitle={item.title}
                      studentEmail={email}
                      studentPhone={phone}
                      onCancel={() => setIsPaidDemo(false)}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleBuySubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2D8C3] text-sm text-[var(--navy)] placeholder:text-[var(--navy)]/40 focus:outline-none focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)]"
                      />
                      <span className="text-[11px] text-[#E05342] font-medium block mt-1">
                        This field is mandatory
                      </span>
                    </div>

                    {/* Phone Input */}
                    <div>
                      <div className="flex rounded-xl border border-[#E2D8C3] overflow-hidden focus-within:border-[var(--coral)] focus-within:ring-1 focus-within:ring-[var(--coral)]">
                        <span className="px-3.5 py-3 bg-[#F5EEDF]/40 border-r border-[#E2D8C3] text-xs font-mono text-[var(--navy)]/70 flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white text-sm text-[var(--navy)] placeholder:text-[var(--navy)]/40 focus:outline-none"
                        />
                      </div>
                      <span className="text-[11px] text-[#E05342] font-medium block mt-1">
                        This field is mandatory
                      </span>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="pt-2 border-t border-[#E2D8C3] space-y-1.5 text-sm">
                      <div className="flex items-center justify-between text-[var(--navy)]/70">
                        <span>Sub Total</span>
                        <span className="font-semibold text-[var(--navy)]">₹{item.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-base font-bold text-[var(--navy)] pt-1">
                        <span>Total</span>
                        <span className="text-xl text-[var(--navy)]">₹{item.price}</span>
                      </div>
                    </div>

                    {/* Black Primary CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-black hover:bg-black/85 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-md cursor-pointer mt-2"
                    >
                      <span>Get it now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="mt-4 pt-3 text-[11px] font-mono text-[var(--navy)]/50 text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-[var(--coral)]" />
                  <span>Encrypted watermarked PDF delivery</span>
                </div>
              </div>

              {/* Invite Your Network Card */}
              <div className="bg-white rounded-2xl border border-[#E2D8C3] p-5 shadow-sm space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--navy)]/60 font-semibold block text-center">
                  Invite Your Network
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#E2D8C3] bg-white hover:bg-[#F5EEDF]/40 text-xs sm:text-sm font-semibold text-[var(--navy)] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[var(--navy)]/70" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </Container>
      </main>

      {/* Mobile Sticky Bottom Buy Bar (Always available on smaller viewports) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2D8C3] p-3.5 px-6 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold font-serif text-[var(--coral)] block">
              ₹{item.price}
            </span>
            <span className="text-xs text-[var(--navy)]/60 font-mono block">
              {item.pageCount} Pages • Digital PDF
            </span>
          </div>

          <button
            onClick={() => setIsBuyModalOpen(true)}
            className="flex-1 py-3 px-6 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/90 transition flex items-center justify-center gap-2 shadow"
          >
            <span>Get it now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet Checkout Dialog */}
      {isBuyModalOpen && (
        <div
          onClick={() => setIsBuyModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end justify-center animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border-t border-[#E2D8C3] rounded-t-3xl p-6 sm:p-7 shadow-2xl max-h-[85dvh] overflow-y-auto custom-scroll animate-in slide-in-from-bottom"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E2D8C3] mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--navy)]/60">
                  Direct Access
                </span>
                <h3 className="font-serif font-bold text-lg text-[var(--navy)]">
                  {item.title}
                </h3>
              </div>
              <span className="font-serif font-bold text-lg text-[var(--coral)]">
                ₹{item.price}
              </span>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2D8C3] text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--coral)]"
                />
                <span className="text-[11px] text-[#E05342] font-medium block mt-1">
                  This field is mandatory
                </span>
              </div>

              <div>
                <div className="flex rounded-xl border border-[#E2D8C3] overflow-hidden">
                  <span className="px-3.5 py-3 bg-[#F5EEDF]/40 border-r border-[#E2D8C3] text-xs font-mono text-[var(--navy)]/70 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Phone number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-sm text-[var(--navy)] focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-[#E05342] font-medium block mt-1">
                  This field is mandatory
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBuyModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-[#E2D8C3] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-black text-white font-bold text-sm shadow hover:bg-black/90"
                >
                  Get it now for ₹{item.price}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Page Zoom Modal */}
      {activePreview && (
        <div 
          onClick={() => setActivePreview(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#E2D8C3] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D8C3]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--coral)] font-bold">
                  Handwritten Sample
                </span>
                <h3 className="font-serif font-bold text-lg text-[var(--navy)]">
                  {activePreview}
                </h3>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--navy)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-xl bg-[#F5EEDF]/40 border border-[#E2D8C3] text-center space-y-3">
              <FileText className="w-12 h-12 text-[var(--coral)] mx-auto" />
              <p className="text-sm text-[var(--navy)]/80 leading-relaxed">
                Full high-resolution stamped PDF page with clinical flowcharts and examination summaries is unlocked instantly upon checkout.
              </p>
              <div className="p-3 bg-white rounded-lg text-xs font-mono text-[var(--navy)]/60 border border-[#E2D8C3]">
                Watermark stamped: Buyer Name + Phone (+91) + Order ID
              </div>
            </div>

            <button
              onClick={() => {
                setActivePreview(null);
                setIsBuyModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/90 transition shadow"
            >
              Get Complete {item.pageCount} Pages (₹{item.price})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

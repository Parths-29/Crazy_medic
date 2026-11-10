"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowLeft, Maximize2, Minimize2, EyeOff, AlertTriangle } from "lucide-react";

interface ProtectedPdfViewerProps {
  orderId: string;
  noteTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  pdfUrl: string;
}

export function ProtectedPdfViewer({
  orderId,
  noteTitle,
  studentName,
  studentEmail,
  studentPhone,
  pdfUrl,
}: ProtectedPdfViewerProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deterrentNotice, setDeterrentNotice] = useState<string | null>(null);

  /**
   * Honest note on Web PDF Security:
   * Browsers cannot physically prevent OS-level hardware screenshots.
   * Therefore, we combine:
   * 1) Server-side `pdf-lib` forensic watermarking burned into the PDF bytes (the real leak trace).
   * 2) Client-side deterrence (tab-switch focus blur, right-click & print blocking, CSS overlay).
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(key)) {
        e.preventDefault();
        setDeterrentNotice("Printing, saving, and copying are disabled to protect creator copyright.");
        setTimeout(() => setDeterrentNotice(null), 3500);
      }
      if (e.key === "PrintScreen") {
        setIsBlurred(true);
        setDeterrentNotice("Screenshots are traced with your verified phone & order ID.");
        setTimeout(() => {
          setDeterrentNotice(null);
          setIsBlurred(false);
        }, 3000);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const watermarkStamp = `${studentName.toUpperCase()} • +91 ${studentPhone} • #${orderId.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#141A2E] text-[var(--cream)] flex flex-col select-none print:hidden">
      {/* Top Protected Toolbar */}
      <header className="border-b border-white/10 bg-[#141A2E] px-4 sm:px-8 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--cream)] transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Library</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[var(--coral)]" />
              <h1 className="font-serif font-bold text-sm sm:text-base text-[var(--cream)] line-clamp-1">
                {noteTitle}
              </h1>
            </div>
            <span className="text-[10px] font-mono text-[var(--cream)]/60 block">
              Licensed to {studentEmail} • +91 {studentPhone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[var(--coral)]">
            <ShieldAlert className="w-3 h-3" />
            FORENSIC WATERMARK ACTIVE
          </span>
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--cream)] transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Deterrent Toast Warning */}
      {deterrentNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[var(--coral)] text-[var(--navy)] border-2 border-[var(--navy)] shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{deterrentNotice}</span>
        </div>
      )}

      {/* Main Protected Document Canvas Viewport */}
      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* PDF Frame with Focus Guard */}
        <div
          className={`w-full max-w-5xl h-[84dvh] rounded-xl overflow-hidden border-2 border-white/15 bg-white shadow-2xl relative transition-all duration-300 ${
            isBlurred ? "blur-2xl opacity-10 scale-[0.98]" : "opacity-100"
          }`}
        >
          {/* Floating CSS Forensic Watermark Grid Overlay (non-interactive pointer-events-none) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex flex-wrap items-center justify-around gap-16 opacity-[0.09] -rotate-12 select-none"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <span
                key={idx}
                className="font-mono font-black text-xs sm:text-sm text-[#141A2E] whitespace-nowrap tracking-widest"
              >
                {watermarkStamp}
              </span>
            ))}
          </div>

          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title={noteTitle}
            className="w-full h-full border-0 relative z-10"
          />
        </div>

        {/* Focus Lost / Privacy Conceal Overlay */}
        {isBlurred && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#141A2E]/85 backdrop-blur-md text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--coral)] text-[var(--navy)] flex items-center justify-center mb-4 border-2 border-white/20 shadow-lg">
              <EyeOff className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[var(--cream)] mb-2">
              Protected Study Content Concealed
            </h2>
            <p className="text-xs text-[var(--cream)]/70 max-w-sm leading-relaxed mb-5">
              Window focus was lost. Click anywhere inside this window to resume viewing your watermarked notes.
            </p>
            <button
              onClick={() => setIsBlurred(false)}
              className="px-6 py-2.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs cursor-pointer"
            >
              Resume Reading
            </button>
          </div>
        )}
      </div>

      {/* Print blocker style */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}


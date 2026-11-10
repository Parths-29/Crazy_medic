"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookItem } from "./notebook-data";
import { Lock, ChevronLeft, ChevronRight, X } from "lucide-react";

interface NotebookProps {
  item: NotebookItem;
  isOpen: boolean;
  isActive?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onBuy?: () => void;
}

interface FlipState {
  from: number;
  to: number;
  direction: "next" | "prev";
}

export function Notebook({
  item,
  isOpen,
  isActive = true,
  onOpen,
  onClose,
  onBuy,
}: NotebookProps) {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const totalSpreads = item.spreads.length;

  // Reset spread back to start when switching books or closing
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setCurrentSpreadIndex(0);
        setFlipState(null);
      }, 450);
      return () => clearTimeout(t);
    }
  }, [isOpen, item.id]);

  // Keyboard navigation while open
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentSpreadIndex, flipState]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (flipState) return; // Prevent double-flip mid-turn
    if (currentSpreadIndex < totalSpreads) {
      setFlipState({
        from: currentSpreadIndex,
        to: currentSpreadIndex + 1,
        direction: "next",
      });
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (flipState) return;
    if (currentSpreadIndex > 0) {
      setFlipState({
        from: currentSpreadIndex,
        to: currentSpreadIndex - 1,
        direction: "prev",
      });
    }
  };

  const finishFlip = () => {
    if (flipState) {
      setCurrentSpreadIndex(flipState.to);
      setFlipState(null);
    }
  };

  // Helper: render Left Page for spread index `idx`
  const renderLeftPage = (idx: number) => {
    if (idx >= totalSpreads) {
      // Back cover inner page before final lock page
      return (
        <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-between bg-[#EFE6D2] text-[var(--navy)] select-none">
          <div className="flex items-center justify-between border-b border-black/10 pb-2">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--navy)]/60">
              {item.subject}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[var(--navy)]/40">
              Preview Complete
            </span>
          </div>
          <div className="my-auto text-center px-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-ink)] font-bold block mb-2">
              {item.tagline}
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--navy)] mb-2">
              {item.chapters.length} Complete Chapters
            </h3>
            <p className="text-xs text-[var(--navy)]/70 leading-relaxed">
              Every chapter includes crisp hand-drawn diagrams, high-yield university questions, and clinical flowcharts curated by {item.creator}.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[var(--navy)]/45 border-t border-black/10 pt-2 text-center">
            The Crazy Medic • Licensed Edition
          </div>
        </div>
      );
    }

    const spread = item.spreads[idx];
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-[#F7F1E5] text-[var(--navy)] select-none">
        <div>
          <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--navy)]/60">
              {item.subject}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--navy)]/45">
              p. {idx * 2 + 1}
            </span>
          </div>
          <h3 className="font-serif font-bold text-sm sm:text-base lg:text-lg text-[var(--coral-ink)] leading-snug mb-1.5 line-clamp-2">
            {spread?.leftPage?.title}
          </h3>
          <p className="text-[11px] sm:text-xs lg:text-[13px] text-[var(--navy)]/80 mb-2.5 leading-relaxed line-clamp-5">
            {spread?.leftPage?.text}
          </p>

          {spread?.leftPage?.bulletPoints && (
            <ul className="space-y-1.5 text-[10px] sm:text-xs text-[var(--navy)]/90 font-mono">
              {spread.leftPage.bulletPoints.slice(0, 4).map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[var(--coral)] font-bold">•</span>
                  <span className="line-clamp-2">{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {spread?.leftPage?.diagramLabel && (
          <div className="p-2 sm:p-2.5 rounded-lg bg-black/5 text-[10px] sm:text-[11px] text-[var(--navy)]/75 italic text-center border border-black/5 mt-2">
            {spread.leftPage.diagramLabel}
          </div>
        )}
      </div>
    );
  };

  // Helper: render Right Page for spread index `idx`
  const renderRightPage = (idx: number) => {
    if (idx >= totalSpreads) {
      return (
        <div className="w-full h-full p-5 sm:p-8 flex flex-col items-center justify-center text-center bg-[#F5EEDF] text-[var(--navy)] select-none">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--coral)]/15 flex items-center justify-center mb-3 text-[var(--coral-ink)] border border-[var(--coral)]/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-2xl text-[var(--navy)] mb-2">
            Unlock Full {item.pageCount} Pages
          </h3>
          <p className="text-[11px] sm:text-xs text-[var(--navy)]/70 max-w-xs mb-5 leading-relaxed">
            Get instant watermarked access to all remaining chapters, high-yield clinical tables, and viva pearls.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuy?.();
            }}
            className="px-6 py-2.5 sm:py-3 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs sm:text-sm hover:bg-[var(--coral-hover)] transition shadow-md cursor-pointer"
          >
            Unlock Notes • ₹{item.price}
          </button>
        </div>
      );
    }

    const spread = item.spreads[idx];
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-[#F4ECDC] text-[var(--navy)] select-none">
        <div>
          <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--navy)]/45">
              p. {idx * 2 + 2}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[var(--coral-ink)] font-bold">
              Sample Excerpt
            </span>
          </div>
          <h3 className="font-serif font-bold text-sm sm:text-base lg:text-lg text-[var(--coral-ink)] leading-snug mb-1.5 line-clamp-2">
            {spread?.rightPage?.title}
          </h3>
          <p className="text-[11px] sm:text-xs lg:text-[13px] text-[var(--navy)]/80 mb-2.5 leading-relaxed line-clamp-4">
            {spread?.rightPage?.text}
          </p>

          {spread?.rightPage?.highlight && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--coral)]/12 border-l-4 border-[var(--coral)] text-[10px] sm:text-xs font-medium text-[var(--navy)] mb-2.5 leading-relaxed line-clamp-3">
              {spread.rightPage.highlight}
            </div>
          )}

          {spread?.rightPage?.bulletPoints && (
            <ul className="space-y-1.5 text-[10px] sm:text-xs text-[var(--navy)]/90 font-mono">
              {spread.rightPage.bulletPoints.slice(0, 4).map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[var(--coral)] font-bold">•</span>
                  <span className="line-clamp-2">{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 text-[10px] sm:text-[11px] text-[var(--navy)]/50 font-mono border-t border-black/10 mt-2">
          <span>The Crazy Medic</span>
          <span>
            Spread {idx + 1} of {totalSpreads + 1}
          </span>
        </div>
      </div>
    );
  };

  // Front Cover face used both on closed cover and during the 3D hinge opening swing
  const renderFrontCoverFace = () => (
    <div
      className="w-full h-full rounded-r-2xl rounded-l-md notebook-shadow relative overflow-hidden flex flex-col justify-between p-5 sm:p-7 lg:p-9 border border-white/15"
      style={{
        backgroundColor: item.coverTone || "var(--navy)",
        backgroundImage:
          "radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 75%)",
      }}
    >
      {/* Hardcover Spine indent on left */}
      <div className="absolute left-0 top-0 bottom-0 w-[11%] notebook-spine pointer-events-none border-r border-black/40" />
      <div className="absolute left-[11%] top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none" />

      {/* Debossed foil title area */}
      <div className="pl-5 sm:pl-7 pt-2 sm:pt-4">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--coral)] block mb-2 font-mono">
          The Crazy Medic
        </span>
        <h2 className="font-serif font-bold text-xl sm:text-3xl md:text-4xl text-[var(--cream)] leading-[1.12] tracking-tight line-clamp-3">
          {item.title}
        </h2>
        <span className="text-xs sm:text-sm text-[var(--cream)]/75 font-medium block mt-2">
          by {item.creator}
        </span>
      </div>

      {/* Embossed Medical Line Motif & Page Count */}
      <div className="pl-5 sm:pl-7 pb-1 sm:pb-2">
        <div className="w-14 h-[3px] bg-[var(--coral)] mb-3.5 rounded-full" />
        <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--cream)]/85">
          <span className="font-mono text-xs sm:text-sm">{item.pageCount} Pages</span>
          {isActive && !isOpen && (
            <span className="text-xs sm:text-sm font-semibold text-[var(--coral)] group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              Tap to open →
            </span>
          )}
        </div>
      </div>

      {/* Paper stack visible along right edge */}
      <div className="absolute right-0 top-4 bottom-4 w-3.5 sm:w-4 page-stack rounded-r-[3px] opacity-90 shadow-inner" />
    </div>
  );

  // Determine which static pages sit under any ongoing 3D page flip
  const staticLeftIdx =
    flipState?.direction === "prev" ? flipState.to : currentSpreadIndex;
  const staticRightIdx =
    flipState?.direction === "next" ? flipState.to : currentSpreadIndex;

  return (
    <div
      className="relative select-none flex items-center justify-center"
      style={{ perspective: "2400px" }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ================= CLOSED HARDCOVER STATE ================= */
          <motion.div
            key="closed-book"
            initial={{ scale: 0.96, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 1.03,
              rotateY: -18,
              opacity: 0,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
            onClick={onOpen}
            tabIndex={isActive ? 0 : -1}
            role="button"
            aria-label={`Open notebook ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            }}
            className="relative cursor-pointer group focus:outline-none"
            style={{
              height: "clamp(380px, 65dvh, 720px)",
              aspectRatio: "3 / 4",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-full h-full transition-transform duration-300 group-hover:scale-[1.02] group-hover:-rotate-y-3">
              {renderFrontCoverFace()}
            </div>
          </motion.div>
        ) : (
          /* ================= OPEN 3D BOOK SPREAD WITH HINGED COVER SWING & 3D PAGE TURNS ================= */
          <motion.div
            key="open-book"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
            style={{
              height: "clamp(340px, 62dvh, 660px)",
              maxWidth: "92vw",
              aspectRatio: "3 / 2",
              perspective: "2400px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Outer Hardcover Backing Board */}
            <div
              className="w-full h-full rounded-2xl p-1.5 sm:p-2 notebook-shadow relative flex overflow-visible border border-white/15"
              style={{
                backgroundColor: item.coverTone || "#141A2E",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Inner Cream Paper Block */}
              <div
                className="w-full h-full rounded-xl flex relative bg-[#F5EEDF] shadow-inner overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Stationary Page Base */}
                <div
                  onClick={currentSpreadIndex > 0 ? handlePrev : undefined}
                  className={`w-1/2 h-full relative border-r border-black/10 ${
                    currentSpreadIndex > 0 ? "cursor-pointer" : ""
                  }`}
                >
                  {renderLeftPage(staticLeftIdx)}
                  {/* Inner Spine Gradient on Left Page */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />
                </div>

                {/* Right Stationary Page Base */}
                <div
                  onClick={currentSpreadIndex < totalSpreads ? handleNext : undefined}
                  className={`w-1/2 h-full relative ${
                    currentSpreadIndex < totalSpreads ? "cursor-pointer" : ""
                  }`}
                >
                  {renderRightPage(staticRightIdx)}
                  {/* Inner Spine Gradient on Right Page */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(270deg, transparent 0%, rgba(0,0,0,0.08) 100%)",
                    }}
                  />
                </div>

                {/* 3D HINGED FRONT COVER OPENING SWING (Runs on mount when book opens!) */}
                <motion.div
                  initial={{ rotateY: 0, zIndex: 40 }}
                  animate={{ rotateY: -180, zIndex: 1 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 bottom-0 right-0 w-1/2 pointer-events-none"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front of Cover (Visible at 0deg -> -90deg as it swings open!) */}
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {renderFrontCoverFace()}
                  </div>

                  {/* Inside of Cover (Rotated 180deg, lands cleanly on the left side) */}
                  <div
                    className="absolute inset-0 bg-[#F7F1E5] overflow-hidden rounded-l-xl"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {renderLeftPage(0)}
                  </div>
                </motion.div>

                {/* REAL 3D PAGE FLIPPING LEAF (Visible whenever turning pages Forward or Backward) */}
                {flipState && (
                  <motion.div
                    key={`${flipState.from}-${flipState.to}-${flipState.direction}`}
                    initial={{
                      rotateY: flipState.direction === "next" ? 0 : -180,
                    }}
                    animate={{
                      rotateY: flipState.direction === "next" ? -180 : 0,
                    }}
                    transition={{
                      duration: 0.58,
                      ease: [0.35, 0.05, 0.2, 1],
                    }}
                    onAnimationComplete={finishFlip}
                    className="absolute top-0 bottom-0 right-0 w-1/2 z-30 pointer-events-none shadow-2xl"
                    style={{
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front side of flipping sheet (Faces right: 0deg) */}
                    <div
                      className="absolute inset-0 overflow-hidden bg-[#F4ECDC]"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {flipState.direction === "next"
                        ? renderRightPage(flipState.from)
                        : renderRightPage(flipState.to)}
                      {/* Subtle curl shadow */}
                      <div
                        className="absolute inset-y-0 left-0 w-6 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0,0,0,0.14) 0%, transparent 100%)",
                        }}
                      />
                    </div>

                    {/* Back side of flipping sheet (Faces left: -180deg) */}
                    <div
                      className="absolute inset-0 overflow-hidden bg-[#F7F1E5]"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {flipState.direction === "next"
                        ? renderLeftPage(flipState.to)
                        : renderLeftPage(flipState.from)}
                      {/* Subtle curl shadow */}
                      <div
                        className="absolute inset-y-0 right-0 w-6 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(270deg, rgba(0,0,0,0.14) 0%, transparent 100%)",
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Center Spine Crease Shadow */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 pointer-events-none z-20"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.06) 100%)",
                  }}
                />
              </div>

              {/* Close button in top-right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close notebook"
                className="absolute top-3.5 right-3.5 z-50 p-2 sm:p-2.5 rounded-full bg-black/10 hover:bg-black/20 text-[var(--navy)] transition cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Floating Side Navigation Buttons */}
              {currentSpreadIndex > 0 && (
                <button
                  onClick={handlePrev}
                  disabled={Boolean(flipState)}
                  aria-label="Previous spread"
                  className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-[var(--cream)] hover:bg-white text-[var(--navy)] border-2 border-[var(--navy)] shadow-[3px_3px_0_var(--navy)] active:translate-y-[calc(-50%+2px)] transition cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {currentSpreadIndex < totalSpreads && (
                <button
                  onClick={handleNext}
                  disabled={Boolean(flipState)}
                  aria-label="Next spread"
                  className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] border-2 border-[var(--navy)] shadow-[3px_3px_0_var(--navy)] active:translate-y-[calc(-50%+2px)] transition cursor-pointer disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { NotebookItem } from "./notebook-data";
import { Lock, ChevronLeft, ChevronRight, X } from "lucide-react";

interface NotebookProps {
  item: NotebookItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onBuy?: () => void;
}

export function Notebook({ item, isOpen, onOpen, onClose, onBuy }: NotebookProps) {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const totalSpreads = item.spreads.length;
  const isLastSpread = currentSpreadIndex >= totalSpreads;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSpreadIndex < totalSpreads) {
      setCurrentSpreadIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSpreadIndex > 0) {
      setCurrentSpreadIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative select-none flex items-center justify-center transition-all duration-300">
      {!isOpen ? (
        /* Closed Hardcover Notebook (True Fluid Scale: clamp(400px, 68dvh, 820px) on desktop, ~60dvh on mobile) */
        <div
          onClick={onOpen}
          tabIndex={0}
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
            height: "clamp(340px, 58dvh, 680px)",
            aspectRatio: "3 / 4",
            perspective: "1800px",
          }}
        >
          {/* Main Hardcover Body */}
          <div
            className="w-full h-full rounded-r-2xl rounded-l-md notebook-shadow relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] flex flex-col justify-between p-5 sm:p-7 lg:p-8 border border-white/10"
            style={{
              backgroundColor: item.coverTone || "var(--navy)",
              backgroundImage:
                "radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 75%)",
            }}
          >
            {/* Hardcover Spine indent on left */}
            <div className="absolute left-0 top-0 bottom-0 w-[11%] notebook-spine pointer-events-none border-r border-black/40" />
            <div className="absolute left-[11%] top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none" />

            {/* Debossed foil title area */}
            <div className="pl-5 sm:pl-7 pt-2 sm:pt-3">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--coral)] block mb-1.5 font-mono">
                The Crazy Medic
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[var(--cream)] leading-[1.15] tracking-tight line-clamp-3">
                {item.title}
              </h2>
              <span className="text-xs sm:text-sm text-[var(--cream)]/75 font-medium block mt-1.5">
                by {item.creator}
              </span>
            </div>

            {/* Embossed Medical Line Motif & Page Count */}
            <div className="pl-5 sm:pl-7 pb-1">
              <div className="w-12 h-[2.5px] bg-[var(--coral)] mb-3 rounded-full" />
              <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--cream)]/80">
                <span className="font-mono text-xs">{item.pageCount} Pages</span>
                <span className="text-xs font-semibold text-[var(--coral)] group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  Tap to open →
                </span>
              </div>
            </div>

            {/* Paper stack visible along right edge */}
            <div className="absolute right-0 top-4 bottom-4 w-3.5 page-stack rounded-r-[3px] opacity-90 shadow-inner" />
          </div>
        </div>
      ) : (
        /* Open Notebook Spread (Fixed 3:2 Aspect Ratio, Center Hinged) */
        <div
          className="relative notebook-shadow rounded-2xl flex overflow-hidden border border-white/10 transition-all duration-300 animate-in zoom-in-95"
          style={{
            height: "clamp(300px, 54dvh, 620px)",
            aspectRatio: "3 / 2",
            backgroundColor: "var(--cream)",
            color: "var(--navy)",
          }}
        >
          {/* Close button in top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close notebook"
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 p-2 sm:p-2.5 rounded-full bg-black/10 hover:bg-black/20 text-[var(--navy)] transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Spine crease shadow in the middle */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.12) 100%)",
            }}
          />

          {!isLastSpread ? (
            /* Regular Study Notes Spread */
            <div className="w-full h-full flex divide-x divide-black/10">
              {/* Left Page */}
              <div className="w-1/2 h-full p-3 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--navy)]/60">
                      {item.subject}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[var(--navy)]/40">
                      p. {currentSpreadIndex * 2 + 1}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm lg:text-base text-[var(--coral-ink)] leading-snug mb-1 line-clamp-2">
                    {item.spreads[currentSpreadIndex]?.leftPage?.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[var(--navy)]/80 mb-2 leading-relaxed line-clamp-4">
                    {item.spreads[currentSpreadIndex]?.leftPage?.text}
                  </p>

                  {item.spreads[currentSpreadIndex]?.leftPage?.bulletPoints && (
                    <ul className="space-y-1 text-[10px] sm:text-[11px] text-[var(--navy)]/90 font-mono">
                      {item.spreads[currentSpreadIndex].leftPage.bulletPoints!.slice(0, 3).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-[var(--coral)] font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {item.spreads[currentSpreadIndex]?.leftPage?.diagramLabel && (
                  <div className="p-1.5 sm:p-2 rounded-lg bg-black/5 text-[10px] sm:text-[11px] text-[var(--navy)]/70 italic text-center border border-black/5 mt-1.5 line-clamp-1">
                    {item.spreads[currentSpreadIndex].leftPage.diagramLabel}
                  </div>
                )}
              </div>

              {/* Right Page */}
              <div className="w-1/2 h-full p-3 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden bg-black/[0.015]">
                <div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[var(--navy)]/40">
                      p. {currentSpreadIndex * 2 + 2}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[var(--coral-ink)] font-bold">
                      Sample Excerpt
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm lg:text-base text-[var(--coral-ink)] leading-snug mb-1 line-clamp-2">
                    {item.spreads[currentSpreadIndex]?.rightPage?.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[var(--navy)]/80 mb-2 leading-relaxed line-clamp-3">
                    {item.spreads[currentSpreadIndex]?.rightPage?.text}
                  </p>

                  {item.spreads[currentSpreadIndex]?.rightPage?.highlight && (
                    <div className="p-2 sm:p-2.5 rounded-lg bg-[var(--coral)]/10 border-l-4 border-[var(--coral)] text-[10px] sm:text-[11px] font-medium text-[var(--navy)] mb-2 leading-relaxed line-clamp-2">
                      {item.spreads[currentSpreadIndex].rightPage.highlight}
                    </div>
                  )}

                  {item.spreads[currentSpreadIndex]?.rightPage?.bulletPoints && (
                    <ul className="space-y-1 text-[10px] sm:text-[11px] text-[var(--navy)]/90 font-mono">
                      {item.spreads[currentSpreadIndex].rightPage.bulletPoints!.slice(0, 3).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-[var(--coral)] font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1.5 text-[10px] text-[var(--navy)]/50 font-mono border-t border-black/10 mt-1.5">
                  <span>The Crazy Medic</span>
                  <span>
                    Spread {currentSpreadIndex + 1} of {totalSpreads + 1}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Locked End Page */
            <div className="w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[var(--cream)]">
              <div className="w-16 h-16 rounded-full bg-[var(--coral)]/10 flex items-center justify-center mb-4 text-[var(--coral)]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-3xl text-[var(--navy)] mb-2">
                End of Sample Pages
              </h3>
              <p className="text-xs sm:text-sm text-[var(--navy)]/70 max-w-md mb-6 leading-relaxed">
                The full {item.pageCount}-page notebook contains all remaining chapters, high-yield clinical flowcharts, and drug tables stamped with your verified identity.
              </p>
              <button
                onClick={onBuy}
                className="px-8 py-3.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-sm hover:bg-[var(--coral-hover)] transition shadow-lg cursor-pointer"
              >
                Unlock full notes for ₹{item.price}
              </button>
            </div>
          )}

          {/* Navigation arrow buttons on sides */}
          {currentSpreadIndex > 0 && (
            <button
              onClick={handlePrev}
              aria-label="Previous page"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/10 hover:bg-black/20 text-[var(--navy)] transition shadow cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          <button
            onClick={handleNext}
            aria-label="Next page"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/10 hover:bg-black/20 text-[var(--navy)] transition shadow cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

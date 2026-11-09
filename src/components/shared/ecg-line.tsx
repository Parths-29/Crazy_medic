import React from "react";

export function ECGLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 600 80"
        className="w-full max-w-2xl h-12 stroke-[2.5] fill-none"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 40 L 140 40 L 155 25 L 170 55 L 180 15 L 195 70 L 210 30 L 225 45 L 235 40 L 380 40 L 395 25 L 410 55 L 420 15 L 435 70 L 450 30 L 465 45 L 475 40 L 600 40"
          className="stroke-[#E8443A] ecg-path"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ECGDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 my-8 opacity-60 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E8443A]/40 to-[#E8443A]" />
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="stroke-[#E8443A] shrink-0">
        <path d="M 0 12 L 12 12 L 16 4 L 20 20 L 24 2 L 28 22 L 32 10 L 36 14 L 48 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E8443A]/40 to-[#E8443A]" />
    </div>
  );
}

export function ECGLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 p-6 ${className}`}>
      <svg width="64" height="32" viewBox="0 0 64 32" fill="none" className="stroke-[#E8443A]">
        <path
          d="M 0 16 L 16 16 L 22 4 L 28 28 L 34 2 L 40 30 L 46 12 L 52 18 L 64 16"
          strokeWidth="2.5"
          className="ecg-path"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs text-muted-foreground font-medium animate-pulse">Diagnosing notes...</span>
    </div>
  );
}


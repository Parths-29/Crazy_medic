import React from "react";

export function DNAHelix({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <path d="M10 6C14 12 26 12 30 6" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 34C14 28 26 28 30 34" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 14C12 18 12 22 6 26" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 14C28 18 28 22 34 26" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="9" x2="28" y2="9" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="9" y1="20" x2="31" y2="20" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="12" y1="31" x2="28" y2="31" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

export function CellArt({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="20" cy="20" r="16" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="20" cy="20" r="7" strokeWidth="2" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="28" cy="15" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="28" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function NeuronArt({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="20" r="5" strokeWidth="2" />
      <path d="M7 20L2 18M9 16L5 12M12 15L11 9M15 17L20 13M14 24L10 29" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 20C22 20 25 24 30 22L36 22" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 22L39 19M36 22L39 25" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartArt({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" className={className}>
      <path
        d="M20 33S6 23.5 6 13.5C6 9 9.5 6 14 6C17 6 19 8 20 10C21 8 23 6 26 6C30.5 6 34 9 34 13.5C34 23.5 20 33 20 33Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 14L16 14L18 10L20 18L22 12L24 14L28 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


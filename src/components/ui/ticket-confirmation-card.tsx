"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { CheckCircle2, ShieldCheck } from "lucide-react";

// --- Barcode Generator ---
const Barcode = ({ value }: { value: string }) => {
  const hashCode = (s: string) =>
    s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

  const seed = hashCode(value);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const bars = Array.from({ length: 55 }).map((_, index) => {
    const rand = random(seed + index);
    const width = rand > 0.65 ? 2.5 : 1.5;
    return { width };
  });

  const spacing = 1.5;
  const totalWidth = bars.reduce((acc, bar) => acc + bar.width + spacing, 0) - spacing;
  const svgWidth = 240;
  const svgHeight = 60;
  let currentX = (svgWidth - totalWidth) / 2;

  return (
    <div className="flex flex-col items-center py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-label={`Barcode for order ${value}`}
        className="fill-current text-[var(--navy)]"
      >
        {bars.map((bar, index) => {
          const x = currentX;
          currentX += bar.width + spacing;
          return <rect key={index} x={x} y="6" width={bar.width} height="48" />;
        })}
      </svg>
      <p className="text-xs text-[var(--navy)]/60 tracking-[0.25em] font-mono mt-1 uppercase">
        {value}
      </p>
    </div>
  );
};

// --- Dashed Line Divider ---
const DashedLine = () => (
  <div className="w-full border-t-2 border-dashed border-[#E2D8C3]" aria-hidden="true" />
);

export interface TicketProps extends React.HTMLAttributes<HTMLDivElement> {
  ticketId: string;
  amount: number;
  date?: Date;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  noteTitle: string;
  paymentMethod?: string;
  barcodeValue: string;
  onViewLibrary?: () => void;
}

export const AnimatedTicket = React.forwardRef<HTMLDivElement, TicketProps>(
  (
    {
      className,
      ticketId,
      amount,
      date = new Date(),
      studentName,
      studentEmail,
      studentPhone,
      noteTitle,
      paymentMethod = "UPI • Instant Verified",
      barcodeValue,
      onViewLibrary,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6F59", "#141A2E", "#F5EEDF", "#3ECFB4"],
        });
      } catch (err) {}
    }, []);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm sm:max-w-md bg-white text-[var(--navy)] rounded-3xl shadow-2xl font-sans z-10 border border-[#E2D8C3] overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 duration-500",
          className
        )}
        {...props}
      >
        {/* Cut-out ticket notch circles */}
        <div className="absolute -left-4 top-[56%] -translate-y-1/2 w-8 h-8 rounded-full bg-[#141A2E] border-r border-[#E2D8C3]" />
        <div className="absolute -right-4 top-[56%] -translate-y-1/2 w-8 h-8 rounded-full bg-[#141A2E] border-l border-[#E2D8C3]" />

        {/* Top Confirmation Header with Pulsing Circle */}
        <div className="p-8 pb-6 flex flex-col items-center text-center bg-gradient-to-b from-[#F5EEDF]/40 to-transparent">
          {/* Animated Pulsing Payment Confirmation Circle */}
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute size-20 rounded-full bg-[var(--coral)]/20 animate-ping opacity-60" />
            <div className="relative size-16 rounded-full bg-[var(--coral)] text-white flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--coral)] font-bold">
            Payment Confirmed
          </span>

          <h1 className="text-2xl font-serif font-bold text-[var(--navy)] mt-1">
            Access Granted!
          </h1>
          <p className="text-xs text-[var(--navy)]/70 mt-1 max-w-xs">
            Your study note is stamped with your credentials and added to your library.
          </p>
        </div>

        {/* Ticket Details Body */}
        <div className="px-7 pb-7 space-y-5">
          <DashedLine />

          {/* Note Info */}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--navy)]/50 block">
              Purchased Product
            </span>
            <p className="font-serif font-bold text-base text-[var(--navy)] mt-0.5 line-clamp-1">
              {noteTitle}
            </p>
          </div>

          {/* Amount and Order ID */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-[10px] text-[var(--navy)]/50 uppercase font-mono">Order Ref</p>
              <p className="font-mono font-bold text-xs text-[var(--navy)] mt-0.5">{ticketId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--navy)]/50 uppercase font-mono">Amount Paid</p>
              <p className="font-serif font-bold text-xl text-[var(--coral)] mt-0.5">₹{amount}</p>
            </div>
          </div>

          {/* Student Info & Stamping Details */}
          <div className="p-3.5 rounded-xl bg-[#F5EEDF]/50 border border-[#E2D8C3] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--navy)] text-[var(--cream)] flex items-center justify-center font-serif font-bold text-sm shrink-0">
              {studentName.charAt(0) || "M"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--navy)] truncate">{studentName}</p>
              <p className="text-[11px] font-mono text-[var(--navy)]/60 truncate">
                {studentEmail || studentPhone || "Verified Medical Student"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left text-xs">
            <div>
              <p className="text-[10px] text-[var(--navy)]/50 uppercase font-mono">Payment Mode</p>
              <p className="font-medium text-[var(--navy)] mt-0.5">{paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--navy)]/50 uppercase font-mono">Timestamp</p>
              <p className="font-medium text-[var(--navy)] mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <DashedLine />

          {/* Barcode representation */}
          <Barcode value={barcodeValue} />

          {/* Open In Library CTA */}
          {onViewLibrary && (
            <button
              onClick={onViewLibrary}
              type="button"
              className="w-full py-3.5 rounded-xl bg-black hover:bg-black/85 text-white font-bold text-xs sm:text-sm transition shadow cursor-pointer"
            >
              Open Note in Protected Viewer →
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--navy)]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--coral)]" />
            <span>Watermark dynamically embedded on all pages</span>
          </div>
        </div>
      </div>
    );
  }
);

AnimatedTicket.displayName = "AnimatedTicket";

export default AnimatedTicket;


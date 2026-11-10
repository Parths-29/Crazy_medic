"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, QrCode, Smartphone, CheckCircle2, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

export interface UpiSuccessDetails {
  ticketId: string;
  barcodeValue: string;
  amount: number;
  noteTitle: string;
  studentName: string;
  last4Digits: string;
  paymentMethod: string;
}

export interface UpiPaymentProps {
  amount: number;
  noteTitle: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  upiId?: string; // Merchant VPA e.g. parth@okhdfcbank
  onSuccess?: (details: UpiSuccessDetails) => void;
  onCancel?: () => void;
}

export function UpiPaymentCard({
  amount = 49,
  noteTitle = "Entire Ophthal for Prof Exam",
  studentName = "Student Medico",
  studentEmail = "medico@college.edu",
  studentPhone = "+91 9876543210",
  upiId = "thecrazymedic@upi",
  onSuccess,
  onCancel,
}: UpiPaymentProps) {
  const [tab, setTab] = useState<"qr" | "vpa">("qr");
  const [userVpa, setUserVpa] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "processing" | "success">("waiting");
  const [confirmedTicket, setConfirmedTicket] = useState<{ ticketId: string; barcodeValue: string } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (paymentStatus === "success") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Handle simulating payment approval
  const handleSimulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      const stamp = Date.now().toString();
      const ticketId = `ORD-${stamp.slice(-8)}`;
      const barcodeValue = `CM-${stamp.slice(-10)}`;
      setConfirmedTicket({ ticketId, barcodeValue });
      setPaymentStatus("success");
      onSuccess?.({
        ticketId,
        barcodeValue,
        amount,
        noteTitle,
        studentName,
        last4Digits: "UPI",
        paymentMethod: "UPI Instant QR",
      });
    }, 1500);
  };

  if (paymentStatus === "success" && confirmedTicket) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <AnimatedTicket
          ticketId={confirmedTicket.ticketId}
          amount={amount}
          studentName={studentName}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
          noteTitle={noteTitle}
          paymentMethod="UPI Instant QR"
          barcodeValue={confirmedTicket.barcodeValue}
          onViewLibrary={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/library";
            }
          }}
        />
      </div>
    );
  }

  // Generate a clean stylized QR code representation
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-[#E2D8C3] shadow-xl p-6 sm:p-7 text-[var(--navy)] font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--coral)] text-white font-bold flex items-center justify-center font-serif text-xs shadow-sm">
            ₹
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--navy)]">UPI Payment</h3>
            <span className="text-[11px] font-mono text-[var(--navy)]/60">Instant Medical Notes Access</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-[var(--navy)]/50 block">Payable</span>
          <span className="font-serif font-bold text-xl text-[var(--coral)]">₹{amount}</span>
        </div>
      </div>

      {/* Tabs: Scan QR vs Enter UPI ID */}
      <div className="flex border-b border-[#E2D8C3] my-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => setTab("qr")}
          className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
            tab === "qr"
              ? "text-[var(--coral)] border-b-2 border-[var(--coral)]"
              : "text-[var(--navy)]/50 hover:text-[var(--navy)]"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Dynamic QR</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("vpa")}
          className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
            tab === "vpa"
              ? "text-[var(--coral)] border-b-2 border-[var(--coral)]"
              : "text-[var(--navy)]/50 hover:text-[var(--navy)]"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>UPI ID / App</span>
        </button>
      </div>

      {/* Mode 1: Dynamic QR Code with Animated Payment Circle */}
      {tab === "qr" ? (
        <div className="flex flex-col items-center py-3 text-center space-y-4">
          <div className="relative p-4 rounded-2xl bg-[#F5EEDF]/40 border border-[#E2D8C3] shadow-inner flex flex-col items-center justify-center">
            {/* Animated Pulsing Payment Circle around the QR */}
            <div className="relative size-48 sm:size-52 bg-white rounded-xl p-3 border border-[#E2D8C3] flex items-center justify-center shadow-md">
              {/* Simulated QR Pattern */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--navy)]">
                <rect width="100" height="100" fill="white" />
                {/* Corner finders */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />

                {/* Random decorative QR data blocks */}
                <rect x="36" y="8" width="6" height="12" fill="currentColor" />
                <rect x="46" y="12" width="14" height="6" fill="currentColor" />
                <rect x="38" y="24" width="8" height="8" fill="currentColor" />
                <rect x="52" y="22" width="10" height="12" fill="currentColor" />
                
                <rect x="10" y="38" width="8" height="6" fill="currentColor" />
                <rect x="22" y="42" width="16" height="8" fill="currentColor" />
                <rect x="42" y="38" width="14" height="14" rx="2" fill="#FF6F59" />
                <rect x="62" y="40" width="8" height="16" fill="currentColor" />
                <rect x="76" y="36" width="16" height="8" fill="currentColor" />

                <rect x="36" y="60" width="12" height="6" fill="currentColor" />
                <rect x="54" y="62" width="6" height="14" fill="currentColor" />
                <rect x="40" y="72" width="10" height="18" fill="currentColor" />
                <rect x="68" y="70" width="12" height="6" fill="currentColor" />
                <rect x="84" y="76" width="8" height="14" fill="currentColor" />
              </svg>

              {/* Center Logo in QR */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-8 rounded-lg bg-[var(--coral)] text-white font-serif font-black text-xs flex items-center justify-center shadow-md">
                  CM
                </div>
              </div>
            </div>

            {/* Payment Pulse Circle */}
            <div className="flex items-center gap-2 mt-3 text-xs font-mono text-[var(--navy)]/80">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--coral)] opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-[var(--coral)]"></span>
              </span>
              <span>Awaiting UPI authorization</span>
            </div>
          </div>

          <p className="text-xs text-[var(--navy)]/70">
            Open <span className="font-bold">Google Pay, PhonePe, Paytm or BHIM</span> on your phone and scan the QR code to complete payment.
          </p>
        </div>
      ) : (
        /* Mode 2: UPI ID */
        <div className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--navy)] block mb-1.5">
              Enter your UPI ID / VPA
            </label>
            <div className="flex rounded-xl border border-[#E2D8C3] overflow-hidden focus-within:border-[var(--coral)]">
              <input
                type="text"
                placeholder="yourname@okaxis"
                value={userVpa}
                onChange={(e) => setUserVpa(e.target.value)}
                className="w-full px-4 py-3 bg-white text-sm text-[var(--navy)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="px-4 py-3 bg-[var(--coral)] text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-[var(--coral-hover)]"
              >
                Send Request
              </button>
            </div>
            <span className="text-[11px] font-mono text-[var(--navy)]/50 block mt-1">
              Supports @okaxis, @okhdfcbank, @paytm, @ybl, etc.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5EEDF]/40 border border-[#E2D8C3] space-y-1 text-xs text-[var(--navy)]/80">
            <p className="font-semibold">Merchant UPI details:</p>
            <p className="font-mono text-[11px] text-[var(--coral)]">{upiId}</p>
          </div>
        </div>
      )}

      {/* Timer & Safety note */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2D8C3] text-xs font-mono text-[var(--navy)]/70">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--coral)]" />
          <span>Valid for: {formattedTime}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      {/* Simulate Approval Button (For testing end-to-end payment confirmation) */}
      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={paymentStatus === "processing"}
          className="w-full py-3.5 rounded-xl bg-black hover:bg-black/85 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow cursor-pointer"
        >
          {paymentStatus === "processing" ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying with Bank...</span>
            </>
          ) : (
            <>
              <span>Simulate Successful UPI Payment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs font-semibold text-[var(--navy)]/60 hover:text-[var(--navy)]"
          >
            Cancel and choose another method
          </button>
        )}
      </div>
    </div>
  );
}

export default UpiPaymentCard;


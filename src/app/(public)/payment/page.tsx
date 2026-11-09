"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, QrCode, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { UpiPaymentCard } from "@/components/ui/upi-payment-card";
import { CreditCardForm, CardState, CardValidity } from "@/components/ui/credit-card-form";
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

export default function PaymentDemoPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-[var(--navy)]">Loading Payment Gateway...</div>}>
      <PaymentDemoContent />
    </Suspense>
  );
}

function PaymentDemoContent() {
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const amount = 49;
  const noteTitle = "Entire Ophthal for Prof Exam (60 Pages)";

  const handleCardSubmit = (state: CardState, validity: CardValidity) => {
    if (!validity.allValid) return;
    setConfirmedOrder({
      ticketId: `ORD-${Date.now().toString().slice(-8)}`,
      amount,
      noteTitle,
      studentName: state.holder || "Student Medico",
      last4Digits: state.number.slice(-4) || "4321",
      paymentMethod: "Credit Card (Encrypted)",
    });
  };

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] pb-16">
      {/* Top Header */}
      <header className="border-b border-[#E2D8C3] bg-white/70 backdrop-blur-sm py-4">
        <Container wide className="flex items-center justify-between">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--navy)]/70 hover:text-[var(--coral)] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notes</span>
          </Link>

          <div className="text-right">
            <span className="font-serif font-bold text-sm sm:text-base text-[var(--navy)] block leading-none">
              The Crazy Medic
            </span>
            <span className="text-[11px] font-mono text-[var(--coral)] block mt-0.5">
              Secure Checkout
            </span>
          </div>
        </Container>
      </header>

      <main className="py-8 sm:py-12">
        <Container>
          {confirmedOrder ? (
            /* Confirmed Order State with Animated Ticket */
            <div className="flex flex-col items-center justify-center space-y-4">
              <AnimatedTicket
                ticketId={confirmedOrder.ticketId}
                amount={confirmedOrder.amount}
                studentName={confirmedOrder.studentName}
                noteTitle={confirmedOrder.noteTitle}
                paymentMethod={confirmedOrder.paymentMethod}
                barcodeValue={`CM-${Date.now().toString().slice(-10)}`}
                onViewLibrary={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/library";
                  }
                }}
              />
              <button
                onClick={() => setConfirmedOrder(null)}
                className="text-xs font-semibold text-[var(--coral)] underline cursor-pointer pt-2"
              >
                ← Back to payment methods
              </button>
            </div>
          ) : (
            /* Payment Selection & Gateway Stage */
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] font-bold">
                  256-Bit SSL Encrypted
                </span>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--navy)]">
                  Complete Your Note Purchase
                </h1>
                <p className="text-xs sm:text-sm text-[var(--navy)]/70 max-w-md mx-auto">
                  Instant watermarked PDF access unlocked in your library upon payment confirmation.
                </p>
              </div>

              {/* Method Switcher: UPI vs Card */}
              <div className="max-w-md mx-auto flex p-1.5 rounded-2xl bg-white border border-[#E2D8C3] shadow-sm">
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    method === "upi"
                      ? "bg-[var(--coral)] text-white shadow"
                      : "text-[var(--navy)]/70 hover:text-[var(--navy)]"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay via UPI (GPay/PhonePe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    method === "card"
                      ? "bg-[var(--coral)] text-white shadow"
                      : "text-[var(--navy)]/70 hover:text-[var(--navy)]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Credit Card</span>
                </button>
              </div>

              {/* Payment View Component */}
              <div className="pt-2">
                {method === "upi" ? (
                  <UpiPaymentCard
                    amount={amount}
                    noteTitle={noteTitle}
                    studentName="Dr. Medico"
                    studentEmail="student@medical.edu"
                    studentPhone="+91 9876543210"
                    onSuccess={(details) => setConfirmedOrder(details)}
                  />
                ) : (
                  <CreditCardForm
                    amount={amount}
                    defaultHolder="DR. MEDICO"
                    onSubmit={handleCardSubmit}
                  />
                )}
              </div>

              {/* Trust Footer */}
              <div className="pt-6 border-t border-[#E2D8C3] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--navy)]/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--coral)]" />
                  <span>Verified Creator: Vismay Sharma</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Watermark Stamping</span>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}


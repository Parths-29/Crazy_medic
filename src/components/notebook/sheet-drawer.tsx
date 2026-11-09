"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NotebookItem } from "./notebook-data";
import { X, Check, ShieldCheck, ArrowRight, Loader2, Download, AlertCircle } from "lucide-react";
import { AnimatedTicket } from "@/components/ui/ticket-confirmation-card";

interface SheetDrawerProps {
  type: "details" | "buy" | "about" | "menu" | null;
  item: NotebookItem;
  onClose: () => void;
  onOpenBuy: () => void;
}

export function SheetDrawer({ type, item, onClose, onOpenBuy }: SheetDrawerProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<any>(null);

  if (!type) return null;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteSlug: item.slug || item.id,
          email,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to initiate payment");
      } else {
        setCreatedOrder(data);
      }
    } catch (err: any) {
      setErrorMessage("Network error connecting to payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!createdOrder) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.orderId,
          razorpayOrderId: createdOrder.razorpayOrderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: "simulated_signature",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Payment verification failed");
      } else {
        setVerifiedOrder(data);
      }
    } catch (err) {
      setErrorMessage("Error verifying payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center sm:justify-end animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md h-[85dvh] sm:h-full bg-[var(--navy)] border-t sm:border-l border-white/10 rounded-t-3xl sm:rounded-none p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-scroll shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 text-[var(--cream)]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--coral)]">
              {type === "details"
                ? "Notebook Specifications"
                : type === "buy"
                ? "Direct Checkout"
                : type === "about"
                ? "About The Creator"
                : "Navigation"}
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[var(--cream)] mt-0.5">
              {type === "about"
                ? "The Crazy Medic"
                : type === "menu"
                ? "Menu"
                : item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Body Content */}
        <div className="flex-1 py-6 space-y-6 text-sm text-[var(--cream)]/80 leading-relaxed overflow-y-auto custom-scroll">
          {type === "details" && (
            <>
              <div>
                <h4 className="text-[var(--coral)] font-semibold text-xs uppercase tracking-wider mb-2 font-mono">
                  Overview
                </h4>
                <p className="text-sm leading-relaxed text-[var(--cream)]/90">{item.summary}</p>
              </div>

              <div>
                <h4 className="text-[var(--coral)] font-semibold text-xs uppercase tracking-wider mb-2.5 font-mono">
                  Chapters Included ({item.chapters.length})
                </h4>
                <div className="space-y-2">
                  {item.chapters.map((ch, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--cream)]/90">
                      <Check className="w-4 h-4 text-[var(--coral)] shrink-0 mt-0.5" />
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-[var(--cream)]/60 font-mono">Digital PDF access</span>
                  <span className="text-xl font-bold font-serif text-[var(--coral)]">₹{item.price}</span>
                </div>
                <button
                  onClick={onOpenBuy}
                  className="px-6 py-2.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs hover:bg-[var(--coral-hover)] transition shadow"
                >
                  Buy Notebook
                </button>
              </div>
            </>
          )}

          {type === "buy" && (
            <>
              {verifiedOrder ? (
                /* 3. Verified Ticket Confirmation */
                <div className="flex flex-col items-center">
                  <AnimatedTicket
                    ticketId={`TKT-${verifiedOrder.orderId.substring(0, 8).toUpperCase()}`}
                    amount={item.price}
                    studentName={email.split("@")[0]}
                    studentEmail={email}
                    studentPhone={`+91 ${phone}`}
                    noteTitle={item.title}
                    barcodeValue={verifiedOrder.orderId.substring(0, 12).toUpperCase()}
                    className="w-full"
                  />
                  <div className="mt-4 w-full">
                    <a
                      href={verifiedOrder.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-sm hover:bg-[var(--coral-hover)] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Open Watermarked Notes (PDF)</span>
                    </a>
                  </div>
                </div>
              ) : createdOrder ? (
                /* 2. Razorpay / UPI Payment Step */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-[var(--cream)]/60 font-mono block">Order ID: {createdOrder.orderId}</span>
                    <h4 className="font-serif font-bold text-lg text-[var(--cream)] mt-1">{item.title}</h4>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-[var(--cream)]/70">Total Amount</span>
                      <span className="text-xl font-mono font-bold text-[var(--coral)]">₹{item.price}</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-2">
                    <span className="text-emerald-400 font-semibold block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Razorpay Test Gateway Ready
                    </span>
                    <p className="text-[var(--cream)]/70">
                      Licensed directly to <strong className="text-[var(--cream)]">{email}</strong> and <strong className="text-[var(--cream)]">+91 {phone}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-sm hover:bg-[var(--coral-hover)] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Payment of ₹{item.price}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* 1. Customer Email & Phone Input Form */
                <>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--cream)]/60 font-mono block">Selected Notebook</span>
                      <span className="font-serif font-bold text-base text-[var(--cream)]">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-lg font-bold text-[var(--coral)]">
                      ₹{item.price}
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--cream)] block mb-1">
                        Email Address (receipt & permanent access)
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@medical.edu"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--cream)] block mb-1">
                        Phone Number (+91 WhatsApp for alerts)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                      />
                    </div>

                    <div className="pt-2 text-xs text-[var(--cream)]/60 space-y-1 font-mono">
                      <p>• PDF is digitally stamped with your name, email & verified phone.</p>
                      <p>• Accessible on your mobile phone and laptop simultaneously.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-sm hover:bg-[var(--coral-hover)] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Order...</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to Pay ₹{item.price}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </>
          )}

          {type === "about" && (
            <div className="space-y-4 text-sm">
              <p>
                "The Crazy Medic" is curated by <strong className="text-[var(--coral)]">Vismay Sharma</strong>.
              </p>
              <p>
                Born out of the frustration with 800-page medical textbooks, these notes synthesize high-yield criteria, clinical flowcharts, and memory anchors directly tailored for distinction in university examinations.
              </p>
              <div className="pt-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-5 py-2.5 rounded-full border border-white/15 text-[var(--cream)] text-xs font-semibold hover:bg-white/5 transition"
                >
                  Follow @thecrazymedic on Instagram →
                </a>
              </div>
            </div>
          )}

          {type === "menu" && (
            <div className="space-y-3 font-medium text-sm text-[var(--cream)]">
              <Link
                href="/"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)]"
              >
                Home (Intro Page)
              </Link>
              <Link
                href="/stage"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)] text-[var(--coral)]"
              >
                Notebook Stage
              </Link>
              <Link
                href="/notes"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)]"
              >
                All Notes Catalog
              </Link>
              <Link
                href="/library"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)]"
              >
                My Purchased Library
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)]"
              >
                Account Login
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 hover:text-[var(--coral)]"
              >
                About Vismay Sharma
              </Link>
              <Link
                href="/terms"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 text-[var(--cream)]/60 hover:text-[var(--cream)]"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund-policy"
                onClick={onClose}
                className="block py-2.5 border-b border-white/10 text-[var(--cream)]/60 hover:text-[var(--cream)]"
              >
                Refund & Cancellation Policy
              </Link>
            </div>
          )}
        </div>

        {/* Bottom subtle note */}
        <div className="pt-4 border-t border-white/10 text-xs text-[var(--cream)]/50 flex items-center justify-between font-mono">
          <span>The Crazy Medic</span>
          <span>by Vismay Sharma</span>
        </div>
      </div>
    </div>
  );
}

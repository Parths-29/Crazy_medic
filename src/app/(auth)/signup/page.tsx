"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, BookOpen, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devVerifyLink, setDevVerifyLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setSuccess("Account registered! Please verify your email.");
      if (data.verifyUrlDev) {
        setDevVerifyLink(data.verifyUrlDev);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-navy min-h-screen text-[var(--cream)] flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[var(--cream)]/70 hover:text-[var(--cream)] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Stage</span>
          </Link>

          <div className="text-right">
            <span className="font-serif font-bold text-sm sm:text-base text-[var(--cream)] block leading-none">
              The Crazy Medic
            </span>
            <span className="text-[11px] font-mono text-[var(--coral)] block mt-0.5">
              by Vismay Sharma
            </span>
          </div>
        </div>
      </header>

      {/* Main Responsive 2-Panel on Desktop (1024px+), Single Column on Mobile */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT PANEL: Brand Info (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8 lg:p-10 rounded-3xl bg-[var(--navy-2)] border border-[var(--border-dark)] relative overflow-hidden shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[var(--coral)] text-[var(--navy)] flex items-center justify-center font-serif font-black text-xl mb-6 shadow-md">
              CM
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[var(--coral)] block mb-2">
              Verified Medical Student Portal
            </span>

            <h2 className="font-serif font-bold text-3xl xl:text-4xl text-[var(--cream)] leading-tight mb-4">
              Join thousands of medical students studying smarter.
            </h2>

            <p className="text-sm xl:text-base text-[var(--cream)]/70 leading-relaxed mb-6">
              Create an account to bind purchases to your verified student credentials, enable automatic encrypted watermarking, and read your notes on any device.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-3 font-mono text-xs text-[var(--cream)]/60">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--coral)] shrink-0" />
                <span>Verified identity required for all study note access</span>
              </div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[var(--coral)] shrink-0" />
                <span>Instant access across phone, tablet & desktop</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Signup Form Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[480px] p-6 sm:p-9 rounded-3xl bg-[var(--navy-2)] border border-[var(--border-dark)] shadow-2xl space-y-6">
              
              <div className="text-center sm:text-left">
                <span className="text-xs uppercase font-mono tracking-widest text-[var(--coral)] block mb-1">
                  New Student Registration
                </span>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--cream)]">
                  Create Account
                </h1>
                <p className="text-xs sm:text-sm text-[var(--cream)]/60 mt-1">
                  Set up your personal study library
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 text-xs sm:text-sm text-red-200 flex items-start gap-2.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-emerald-950/60 text-emerald-200 text-xs sm:text-sm border border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{success}</span>
                  </div>
                  {devVerifyLink && (
                    <div className="pt-2 border-t border-emerald-800/60">
                      <a
                        href={devVerifyLink}
                        className="font-bold underline text-[var(--coral)] block truncate mt-1 text-xs"
                      >
                        Click here to verify email token →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--cream)]/90 block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. / Medical Student"
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[var(--cream)]/90 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[var(--cream)]/90 block mb-1.5">
                    Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>{loading ? "Creating..." : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-white/10 text-center text-xs sm:text-sm text-[var(--cream)]/65">
                <span>Already registered? </span>
                <Link href="/login" className="text-[var(--coral)] font-bold hover:underline">
                  Sign in
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[var(--cream)]/40 font-mono">
        The Crazy Medic • by Vismay Sharma
      </footer>
    </div>
  );
}

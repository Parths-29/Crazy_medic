"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FancyButton } from "@/components/ui/fancy-button";
import { 
  EyeIcon, 
  EyeOffIcon, 
  StarIcon, 
  UserIcon, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from "lucide-react";

interface Review {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  college: string;
}

const REVIEWS: Review[] = [
  {
    quote: "Switching to The Crazy Medic notes was the best decision for my Final Prof exams. 60 handwritten pages covered what 3 giant textbooks couldn't explain.",
    name: "Dr. Rohit Verma",
    role: "MBBS Intern",
    college: "King George's Medical University",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "The surgery algorithms and ophthalmology corneal ulcer flowcharts saved my viva. Pure high-yield gold, zero textbook fluff.",
    name: "Kashifa Khan",
    role: "Final Year Student",
    college: "Maulana Azad Medical College",
    avatar: "https://images.unsplash.com/photo-1594824813583-0570f7d0b329?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "Clear diagrams stamped with my name and phone number. I read them on my iPad and phone during clinical postings.",
    name: "Arjun Nambiar",
    role: "NEET PG Aspirant",
    college: "Government Medical College, Kozhikode",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
  },
];

export function SignIn({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams?.get("error");
  const rawCallback = searchParams?.get("callbackUrl");
  const callbackUrl = rawCallback && rawCallback.startsWith("/") ? rawCallback : "/library";

  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const activeReview = REVIEWS[activeReviewIndex];

  // Friendly error messages
  const getErrorMessage = (code: string | null) => {
    if (!code) return null;
    switch (code) {
      case "Configuration":
        return "Google OAuth credentials are missing or invalid. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.";
      case "AccessDenied":
        return "Sign in was canceled or access was denied.";
      case "OAuthAccountNotLinked":
        return "An account with this email already exists under a different sign-in method.";
      case "CredentialsSignin":
        return "Invalid email or password. Please verify your credentials.";
      default:
        return `Sign in error: ${code}`;
    }
  };

  const initialError = getErrorMessage(errorCode);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        setLoading(false);
      } else {
        // Force a clean navigation so server components and headers reflect the persisted session cookie immediately
        window.location.assign(callbackUrl);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOtpMessage(null);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
      } else {
        setOtpSent(true);
        setOtpMessage(
          data.devOtp
            ? `Dev OTP sent: ${data.devOtp} (Check terminal if in dev mode)`
            : "6-digit verification code sent to your mobile."
        );
      }
    } catch {
      setError("Network error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      const authRes = await signIn("credentials", {
        email: phone,
        isPhoneOtp: "true",
        redirect: false,
      });

      if (authRes?.error) {
        setError(authRes.error);
        setLoading(false);
      } else {
        window.location.assign(callbackUrl);
      }
    } catch {
      setError("Network error verifying OTP.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!googleEnabled) {
      setError(
        "Google Login needs your OAuth Client ID & Secret in .env.local (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET) with redirect URI http://localhost:3000/api/auth/callback/google."
      );
      return;
    }
    setError(null);
    signIn("google", { callbackUrl });
  };

  return (
    <main
      aria-label="Sign in"
      className="theme-navy min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[var(--navy)] text-[var(--cream)] overflow-x-hidden"
    >
      {/* ================= LEFT SECTION: AUTH FORM ================= */}
      <section className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Top return link & creator brand */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--cream)]/60 hover:text-[var(--cream)] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <Link
              href="/stage"
              className="text-xs font-mono text-[var(--coral)] hover:underline"
            >
              Stage
            </Link>
          </div>

          <div className="text-right">
            <span className="font-serif font-bold text-sm text-[var(--cream)] block leading-tight">
              The Crazy Medic
            </span>
            <span className="text-[10px] font-mono text-[var(--coral)] block">
              by Parth
            </span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Logo / Badge */}
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="relative flex size-14 items-center justify-center">
              <div className="absolute inset-0 scale-125 rounded-full bg-[var(--coral)]/20 animate-pulse" />
              <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-[var(--navy-2)] border border-[var(--coral)]/40 shadow-lg text-[var(--coral)]">
                <UserIcon aria-hidden="true" className="size-6 text-[var(--coral)]" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-[var(--cream)]">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-[var(--cream)]/60 mt-1">
                Access your stamped medical study notes
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {(error || initialError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-700/60 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error || initialError}</span>
            </div>
          )}

          {/* Tab Selector: Email vs Phone OTP */}
          <div className="flex border-b border-white/10 mb-5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex-1 pb-2.5 font-semibold transition cursor-pointer ${
                tab === "email"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)]"
                  : "text-[var(--cream)]/40 hover:text-[var(--cream)]/70"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex-1 pb-2.5 font-semibold transition cursor-pointer ${
                tab === "phone"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)]"
                  : "text-[var(--cream)]/40 hover:text-[var(--cream)]/70"
              }`}
            >
              Phone (+91 OTP)
            </button>
          </div>

          {/* Form Area */}
          {tab === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor={`${id}-email`} className="text-xs font-semibold text-[var(--cream)]/80 block mb-1.5">
                  Email Address
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  required
                  placeholder="medico@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] placeholder:text-[var(--cream)]/30 focus:outline-none focus:border-[var(--coral)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={`${id}-password`} className="text-xs font-semibold text-[var(--cream)]/80">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[var(--coral)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative flex items-center">
                  <input
                    id={`${id}-password`}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] placeholder:text-[var(--cream)]/30 focus:outline-none focus:border-[var(--coral)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 p-1 text-[var(--cream)]/50 hover:text-[var(--cream)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id={`${id}-remember`}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-[var(--coral)] focus:ring-[var(--coral)]"
                />
                <label htmlFor={`${id}-remember`} className="text-xs text-[var(--cream)]/70 cursor-pointer">
                  Keep me logged in on this device
                </label>
              </div>

              <FancyButton type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Sign in to Library"}
              </FancyButton>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--cream)]/80 block mb-1.5">
                  Phone Number (+91)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-[var(--cream)] placeholder:text-[var(--cream)]/30 focus:outline-none focus:border-[var(--coral)]"
                />
              </div>

              {otpMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-200">
                  {otpMessage}
                </div>
              )}

              {otpSent && (
                <div>
                  <label className="text-xs font-semibold text-[var(--cream)]/80 block mb-1.5">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-center tracking-widest font-mono text-[var(--cream)] focus:outline-none focus:border-[var(--coral)]"
                  />
                </div>
              )}

              <FancyButton type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : otpSent ? "Verify & Sign In" : "Send 6-Digit OTP"}
              </FancyButton>
            </form>
          )}

          {/* Social Divider */}
          <div className="relative text-center text-xs text-[var(--cream)]/40 uppercase my-5 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-white/10 before:content-['']">
            <span className="relative bg-[var(--navy)] px-3">or continue with</span>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-semibold text-[var(--cream)] flex items-center justify-center gap-3 transition cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer join link */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[var(--cream)]/60 mt-6">
            <span>Not registered yet?</span>
            <Link href="/signup" className="text-[var(--coral)] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Small Bottom Copyright */}
        <div className="text-center text-[11px] font-mono text-[var(--cream)]/40">
          The Crazy Medic • Verified Medical Student Platform
        </div>
      </section>

      {/* ================= RIGHT SECTION: REVIEWS & SOCIAL PROOF PANEL ================= */}
      <section className="hidden lg:flex lg:col-span-5 relative flex-col justify-end overflow-hidden rounded-3xl m-3 p-10 xl:p-14 bg-[var(--navy-2)] border border-[var(--border-dark)] shadow-2xl">
        {/* Soft background ambient gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-[var(--navy-2)]/60 to-transparent" />
        
        {/* Decorative Watermark Emblem */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-[var(--coral)]/10 border border-[var(--coral)]/20 flex items-center justify-center text-[var(--coral)] font-serif font-black text-xl">
          CM
        </div>

        <div className="relative flex flex-col gap-6 z-10">
          {/* Star rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <StarIcon
                aria-hidden="true"
                key={rating}
                className="size-5 fill-[var(--coral)] text-[var(--coral)]"
              />
            ))}
            <span className="ml-2 text-xs font-mono text-[var(--cream)]/75">
              Verified Student Review
            </span>
          </div>

          {/* Testimonial Quote */}
          <p className="font-serif text-lg xl:text-xl text-[var(--cream)] leading-relaxed italic">
            &ldquo;{activeReview.quote}&rdquo;
          </p>

          {/* Reviewer Details */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-3.5">
              <img
                src={activeReview.avatar}
                alt={activeReview.name}
                className="size-11 rounded-full object-cover border-2 border-[var(--coral)]"
              />
              <div>
                <p className="text-sm font-bold text-[var(--cream)]">{activeReview.name}</p>
                <p className="text-xs text-[var(--coral)] font-medium">{activeReview.role} • {activeReview.college}</p>
              </div>
            </div>

            {/* Quote cyclers */}
            <div className="flex gap-1.5">
              {REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx)}
                  className={`size-2.5 rounded-full transition cursor-pointer ${
                    activeReviewIndex === idx ? "bg-[var(--coral)] w-6" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Show review ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Verified Anti-Piracy Stamp Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cream)]/60 pt-2">
            <ShieldCheck className="w-4 h-4 text-[var(--coral)] shrink-0" />
            <span>Watermarked with student name & verified contact</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignIn;


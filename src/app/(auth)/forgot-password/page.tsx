"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (data.resetUrlDev) {
        setDevResetUrl(data.resetUrlDev);
      }
    } catch {
      setMessage("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter your registered email and we&apos;ll send you a recovery link
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 shadow-sm">
        {message && (
          <div className="p-4 mb-4 rounded-xl bg-blue-50 text-blue-900 text-xs border border-blue-200">
            <p className="font-semibold">{message}</p>
            {devResetUrl && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <span className="font-medium text-[11px] block text-blue-700">Developer Quick-Reset Link:</span>
                <a
                  href={devResetUrl}
                  className="font-bold underline text-[#E8443A] block truncate mt-0.5"
                >
                  Click here to simulate password reset token
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8443A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-3 rounded-xl bg-[#0F2B3C] text-white font-bold text-sm shadow hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{loading ? "Sending Link..." : "Send Reset Link"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-800 font-semibold">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}


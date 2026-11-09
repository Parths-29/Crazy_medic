"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No verification token found in URL.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        setSuccess(true);
      } catch (err: any) {
        setError(err?.message || "Failed to verify email");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="p-8 rounded-3xl bg-white dark:bg-[#141E2C] border border-gray-100 dark:border-gray-800 shadow-sm">
        {loading && (
          <div className="py-8">
            <Loader2 className="w-10 h-10 text-[#E8443A] animate-spin mx-auto mb-3" />
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Verifying your email...</h2>
            <p className="text-xs text-gray-500 mt-1">Please hold on while we secure your account.</p>
          </div>
        )}

        {!loading && success && (
          <div>
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Your account is now fully verified. You can log in and start studying notes.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#0F2B3C] text-white font-bold text-sm shadow hover:bg-black transition"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!loading && error && (
          <div>
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-xs sm:text-sm text-red-500 mb-6">{error}</p>
            <Link
              href="/login"
              className="inline-block py-2.5 px-6 rounded-xl border border-gray-200 text-xs font-semibold"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}


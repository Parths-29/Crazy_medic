"use client";

import React, { Suspense } from "react";
import SignIn from "@/components/ui/sign-in-3";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="theme-navy min-h-screen flex items-center justify-center text-[var(--cream)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--coral)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
}

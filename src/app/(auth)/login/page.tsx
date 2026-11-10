import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, isGoogleConfigured } from "@/lib/auth";
import SignIn from "@/components/ui/sign-in-3";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  if (session?.user) {
    const dest = params?.callbackUrl || "/library";
    redirect(dest.startsWith("/") ? dest : "/library");
  }

  return (
    <Suspense
      fallback={
        <div className="theme-navy min-h-screen flex items-center justify-center text-[var(--cream)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--coral)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignIn googleEnabled={isGoogleConfigured} />
    </Suspense>
  );
}

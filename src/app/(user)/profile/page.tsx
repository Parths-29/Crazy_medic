import React from "react";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ShieldCheck, BookOpen, LogOut, ArrowRight, Phone, Mail, Sparkles, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { DevicesManager } from "@/components/profile/devices-manager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  await connectDB();
  const dbUser = session.user.id ? await User.findById(session.user.id).lean() : null;

  const displayName = dbUser?.name || session.user.name || "Student Medico";
  const email = dbUser?.email || session.user.email || "";
  const phone = dbUser?.phone || null;
  const isEmailVerified = Boolean(dbUser?.emailVerified);
  const isPhoneVerified = Boolean(dbUser?.phoneVerified);
  const role = dbUser?.role || (session.user as any).role || "user";

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] py-8 sm:py-12">
      <Container className="max-w-3xl">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/stage"
            className="text-xs font-semibold text-[var(--navy)]/70 hover:text-[var(--coral)] transition flex items-center gap-1.5"
          >
            ← Return to Notebook Stage
          </Link>
          <span className="text-xs font-mono text-[var(--navy)]/50">Student Profile</span>
        </div>

        {/* Main Brutalist Card */}
        <div className="bg-white border-3 border-[var(--navy)] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_var(--navy)]">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--navy)]/15">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[var(--coral)] border-2 border-[var(--navy)] text-[var(--navy)] flex items-center justify-center font-serif font-black text-2xl shadow-[3px_3px_0_var(--navy)]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-[var(--navy)]">
                    {displayName}
                  </h1>
                  {role === "admin" && (
                    <span className="text-[11px] font-mono font-bold bg-[var(--coral)] text-[var(--navy)] px-2.5 py-0.5 rounded border border-[var(--navy)]">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-[var(--navy)]/65 mt-0.5">{email}</p>
              </div>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--cream)] hover:bg-[var(--coral)] text-[var(--navy)] text-xs font-bold transition shadow-[2px_2px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>

          {/* Account Security & Verification Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            {/* Email Status */}
            <div className="p-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)]/40 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--navy)]/60 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Verification
                </span>
                <span className="text-xs font-mono text-[var(--navy)]/90 block mt-1 truncate max-w-[200px]">
                  {email}
                </span>
              </div>
              {isEmailVerified ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Unverified
                </span>
              )}
            </div>

            {/* Phone Verification Status */}
            <div className="p-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)]/40 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--navy)]/60 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone / OTP Status
                </span>
                <span className="text-xs font-mono text-[var(--navy)]/90 block mt-1">
                  {phone ? `+91 ${phone}` : "No phone linked"}
                </span>
              </div>
              {isPhoneVerified ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <Link
                  href="/login?phone=1"
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--coral)] text-[var(--navy)] border border-[var(--navy)] hover:opacity-80 transition"
                >
                  Verify Phone →
                </Link>
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Link
              href="/library"
              className="p-3.5 rounded-xl border-2 border-[var(--navy)] bg-white hover:bg-[var(--cream)] transition shadow-[3px_3px_0_var(--navy)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--navy)]">
                <BookOpen className="w-4 h-4 text-[var(--coral)]" />
                <span>My Unlocked Notes Library</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--navy)] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/notes"
              className="p-3.5 rounded-xl border-2 border-[var(--navy)] bg-white hover:bg-[var(--cream)] transition shadow-[3px_3px_0_var(--navy)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--navy)]">
                <Sparkles className="w-4 h-4 text-[var(--coral)]" />
                <span>Browse All Available Notes</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--navy)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Admin shortcut if user is admin */}
          {role === "admin" && (
            <div className="mt-4">
              <Link
                href="/admin"
                className="p-3.5 rounded-xl border-2 border-[var(--coral)] bg-[var(--coral)]/10 hover:bg-[var(--coral)]/20 transition flex items-center justify-between text-[var(--navy)]"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[var(--coral)]" />
                  <span>Creator Admin Dashboard (Upload & Manage Notes)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--coral)]" />
              </Link>
            </div>
          )}

          {/* Active Devices Section */}
          <DevicesManager />
        </div>
      </Container>
    </div>
  );
}

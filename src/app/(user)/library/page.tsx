import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowRight, ArrowLeft, BookOpen, Lock, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/library");
  }

  await connectDB();

  const queryFilter: any = { status: "paid" };
  if (session.user.id && session.user.email) {
    queryFilter.$or = [
      { userId: session.user.id },
      { email: session.user.email.toLowerCase() },
    ];
  } else if (session.user.email) {
    queryFilter.email = session.user.email.toLowerCase();
  }

  const paidOrders = await Order.find(queryFilter).sort({ createdAt: -1 }).lean();

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] pb-20">
      {/* Header */}
      <header className="border-b-2 border-[var(--navy)]/15 bg-white/80 backdrop-blur-sm sticky top-0 z-30 py-4">
        <Container wide className="flex items-center justify-between">
          <Link
            href="/stage"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--navy)]/70 hover:text-[var(--coral)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Notebook Stage</span>
          </Link>
          <span className="font-serif font-black text-base text-[var(--navy)]">
            My Study Library
          </span>
          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/orders" className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              Orders
            </Link>
            <Link href="/profile" className="text-[var(--navy)]/70 hover:text-[var(--coral)] transition">
              Devices & Profile
            </Link>
            <Link href="/notes" className="text-[var(--coral-ink)] hover:underline">
              All Notes →
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          {/* Page Intro */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[var(--navy)]/15 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-mono font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>WATERMARK-LICENSED ACCESS</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-[var(--navy)]">
                My Purchased Notes
              </h1>
              <p className="text-xs text-[var(--navy)]/65 font-mono mt-1">
                Registered identity: {session.user.email}
              </p>
            </div>

            <Link
              href="/notes"
              className="px-5 py-2.5 rounded-xl border-2 border-[var(--navy)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] text-xs font-bold transition shadow-[3px_3px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 self-start sm:self-auto"
            >
              Browse More Notebooks →
            </Link>
          </div>

          {paidOrders.length === 0 ? (
            <div className="p-10 rounded-2xl border-3 border-dashed border-[var(--navy)]/25 bg-white text-center max-w-xl mx-auto my-8">
              <BookOpen className="w-10 h-10 text-[var(--coral)] mx-auto mb-3" />
              <h2 className="font-serif font-black text-xl text-[var(--navy)] mb-2">
                Your Library is Empty
              </h2>
              <p className="text-xs text-[var(--navy)]/70 leading-relaxed mb-6">
                You haven&apos;t unlocked any study notebooks under <strong>{session.user.email}</strong> yet.
                Once you complete checkout, your forensic-watermarked notes will appear here instantly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/stage"
                  className="px-5 py-2.5 rounded-xl border-2 border-[var(--navy)] bg-[var(--coral)] text-[var(--navy)] text-xs font-bold shadow-[3px_3px_0_var(--navy)]"
                >
                  Open 3D Stage
                </Link>
                <Link
                  href="/notes"
                  className="px-5 py-2.5 rounded-xl border-2 border-[var(--navy)] bg-white text-[var(--navy)] text-xs font-bold shadow-[3px_3px_0_var(--navy)]"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidOrders.map((order) => {
                const item = order.items[0];
                const mockMatch = MOCK_NOTEBOOKS.find(
                  (m) => m.slug === item?.slug || m.title === item?.title
                );
                const coverTone = mockMatch?.coverTone || "#141A2E";

                return (
                  <div
                    key={order._id.toString()}
                    className="flex flex-col bg-white border-2 border-[var(--navy)] rounded-2xl p-5 shadow-[5px_5px_0_var(--navy)] justify-between"
                  >
                    <div>
                      {/* Mini Hardcover Badge */}
                      <div
                        className="w-full h-44 rounded-xl border-2 border-[var(--navy)] p-5 flex flex-col justify-between relative overflow-hidden mb-4"
                        style={{ backgroundColor: coverTone }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-[10%] bg-black/30 border-r border-white/10" />
                        <div className="pl-4">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--coral)] block">
                            The Crazy Medic
                          </span>
                          <h3 className="font-serif font-bold text-lg text-[var(--cream)] leading-snug mt-1 line-clamp-2">
                            {item?.title || "Study Notes"}
                          </h3>
                        </div>
                        <div className="pl-4 flex items-center justify-between text-[11px] font-mono text-[var(--cream)]/70">
                          <span>Licensed Copy</span>
                          <span className="text-[var(--coral)] font-bold">
                            ₹{Math.round((order.amount || 0) / 100)} Paid
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono text-[var(--navy)]/70 mb-5">
                        <div className="flex justify-between">
                          <span>Order ID:</span>
                          <span className="font-bold text-[var(--navy)]">
                            #{order._id.toString().slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Licensed To:</span>
                          <span className="truncate max-w-[160px]">+91 {order.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purchased On:</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--navy)]/10">
                      <Link
                        href={`/viewer/${order._id.toString()}`}
                        className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] text-xs font-bold flex items-center justify-center gap-1.5 shadow-[2px_2px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 transition"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Read in Protected Viewer</span>
                      </Link>
                      <a
                        href={`/api/orders/${order._id.toString()}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Raw Watermarked PDF Stream"
                        className="p-2.5 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)] hover:bg-black/5 text-[var(--navy)] transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

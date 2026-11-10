import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Receipt, Lock, ExternalLink, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  await connectDB();
  const filter: any = {};
  if (session.user.id && session.user.email) {
    filter.$or = [{ userId: session.user.id }, { email: session.user.email.toLowerCase() }];
  } else if (session.user.email) {
    filter.email = session.user.email.toLowerCase();
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] py-8 sm:py-12">
      <Container className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--navy)]/70 hover:text-[var(--coral)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Study Library</span>
          </Link>
          <span className="text-xs font-mono text-[var(--navy)]/60">Order History</span>
        </div>

        <div className="bg-white border-3 border-[var(--navy)] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_var(--navy)]">
          <div className="flex items-center gap-3 pb-5 border-b-2 border-[var(--navy)]/15 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[var(--coral)] border-2 border-[var(--navy)] flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[var(--navy)]" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl text-[var(--navy)]">
                Orders & Invoices
              </h1>
              <p className="text-xs font-mono text-[var(--navy)]/60">
                Account: {session.user.email}
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--navy)]/70">
              No orders found yet.{" "}
              <Link href="/notes" className="text-[var(--coral-ink)] font-bold underline">
                Browse notes catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {orders.map((ord) => (
                <div
                  key={ord._id.toString()}
                  className="p-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[var(--navy)]">
                        #{ord._id.toString().slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          ord.status === "paid"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : ord.status === "failed"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="font-serif font-bold text-sm text-[var(--navy)]">
                        {ord.items[0]?.title || "Study Notes"}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[var(--navy)]/65 mt-1">
                      ₹{Math.round((ord.amount || 0) / 100)} •{" "}
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {ord.status === "paid" && (
                      <>
                        <Link
                          href={`/viewer/${ord._id.toString()}`}
                          className="px-3 py-1.5 rounded-lg border-2 border-[var(--navy)] bg-[var(--coral)] text-[var(--navy)] text-xs font-bold flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Read</span>
                        </Link>
                        <a
                          href={`/api/invoice/${ord._id.toString()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg border-2 border-[var(--navy)] bg-white text-[var(--navy)] text-xs font-bold flex items-center gap-1"
                        >
                          <span>Invoice</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                    <Link
                      href="/contact"
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--navy)]/20 text-[11px] font-semibold text-[var(--navy)]/70 hover:text-[var(--coral)] flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Help</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

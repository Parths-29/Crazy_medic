import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { verifyAndRegisterDevice } from "@/lib/device";
import { ProtectedPdfViewer } from "@/components/viewer/protected-pdf-viewer";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/viewer/${orderId}`);
  }

  await connectDB();
  const order = await Order.findById(orderId).lean();

  if (!order || order.status !== "paid") {
    return (
      <div className="min-h-screen bg-[#141A2E] text-[var(--cream)] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl border-2 border-[var(--coral)] bg-white/5 text-center">
          <ShieldAlert className="w-10 h-10 text-[var(--coral)] mx-auto mb-3" />
          <h1 className="font-serif font-bold text-2xl mb-2">Access Restricted</h1>
          <p className="text-xs text-[var(--cream)]/70 mb-6">
            This study notebook order was not found or payment has not been verified yet.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </Link>
        </div>
      </div>
    );
  }

  // Verify ownership (matches userId or email, unless admin)
  const isAdmin = (session.user as any).role === "admin";
  const ownsOrder =
    isAdmin ||
    (order.userId && order.userId.toString() === session.user.id) ||
    (session.user.email && order.email.toLowerCase() === session.user.email.toLowerCase());

  if (!ownsOrder) {
    return (
      <div className="min-h-screen bg-[#141A2E] text-[var(--cream)] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl border-2 border-[var(--coral)] bg-white/5 text-center">
          <ShieldAlert className="w-10 h-10 text-[var(--coral)] mx-auto mb-3" />
          <h1 className="font-serif font-bold text-2xl mb-2">Unauthorized Account</h1>
          <p className="text-xs text-[var(--cream)]/70 mb-6">
            This notebook license belongs to a different account. Please sign in with the email used at checkout.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--coral)] text-[var(--navy)] font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </Link>
        </div>
      </div>
    );
  }

  // Enforce 2-Device Limit
  if (session.user.id && !isAdmin) {
    const deviceResult = await verifyAndRegisterDevice(session.user.id);
    if (!deviceResult.allowed) {
      return (
        <div className="min-h-screen bg-[#F5EEDF] text-[var(--navy)] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl border-3 border-[var(--navy)] bg-white shadow-[6px_6px_0_var(--navy)] text-center">
            <ShieldAlert className="w-10 h-10 text-[var(--coral)] mx-auto mb-3" />
            <h1 className="font-serif font-black text-2xl mb-2">Device Limit Reached (2 / 2)</h1>
            <p className="text-xs text-[var(--navy)]/75 leading-relaxed mb-6">
              {deviceResult.error}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/profile"
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--coral)] text-[var(--navy)] font-bold text-xs shadow-[3px_3px_0_var(--navy)]"
              >
                Manage & Revoke Devices in Profile →
              </Link>
              <Link
                href="/library"
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)] text-[var(--navy)] font-bold text-xs"
              >
                Back to Library
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  let studentName = session.user.name || `Dr. ${order.phone.slice(-4)}`;
  if (order.userId) {
    const userDoc = await User.findById(order.userId).lean();
    if (userDoc?.name) studentName = userDoc.name;
  }

  return (
    <ProtectedPdfViewer
      orderId={orderId}
      noteTitle={order.items[0]?.title || "Study Notes"}
      studentName={studentName}
      studentEmail={order.email}
      studentPhone={order.phone}
      pdfUrl={`/api/orders/${orderId}/download`}
    />
  );
}


import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { ShieldCheck, BarChart3, Users, BookOpen, ShoppingBag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AdminDashboardTabs } from "@/components/admin/admin-dashboard-tabs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  await connectDB();
  const [totalNotes, totalStudents, paidOrders] = await Promise.all([
    Note.countDocuments({}),
    User.countDocuments({}),
    Order.find({ status: "paid" }).lean(),
  ]);

  const totalRevenuePaise = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalRevenueRupees = Math.round(totalRevenuePaise / 100);

  return (
    <div className="theme-cream min-h-screen text-[var(--navy)] bg-[#F5EEDF] py-8 sm:py-12">
      <Container wide>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--coral)] text-[var(--navy)] text-xs font-mono font-bold mb-2 border border-[var(--navy)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN ACCESS ONLY • CREATOR DASHBOARD</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[var(--navy)]">
              The Crazy Medic Control Room
            </h1>
            <p className="text-xs text-[var(--navy)]/65 font-sans mt-1">
              Welcome back, {session?.user?.name || "Parth"}. Manage live notes, student permissions, and store catalog.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/stage"
              className="px-4 py-2 rounded-xl border-2 border-[var(--navy)] bg-white hover:bg-[var(--cream)] text-xs font-bold text-[var(--navy)] transition shadow-[3px_3px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Open Notebook Stage</span>
            </Link>
          </div>
        </div>

        {/* Real Live KPI Cards from Database */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Revenue */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[var(--navy)] shadow-[4px_4px_0_var(--navy)]">
            <div className="flex items-center justify-between text-[var(--navy)]/60 mb-2">
              <span className="text-xs font-mono font-bold">Total Revenue</span>
              <BarChart3 className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <span className="text-2xl font-serif font-black text-[var(--navy)]">
              ₹{totalRevenueRupees.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 block mt-1">
              Verified Razorpay transactions
            </span>
          </div>

          {/* Orders */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[var(--navy)] shadow-[4px_4px_0_var(--navy)]">
            <div className="flex items-center justify-between text-[var(--navy)]/60 mb-2">
              <span className="text-xs font-mono font-bold">Paid Orders</span>
              <ShoppingBag className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <span className="text-2xl font-serif font-black text-[var(--navy)]">
              {paidOrders.length}
            </span>
            <span className="text-[10px] font-mono text-[var(--navy)]/60 block mt-1">
              Automated PDF licenses
            </span>
          </div>

          {/* Students */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[var(--navy)] shadow-[4px_4px_0_var(--navy)]">
            <div className="flex items-center justify-between text-[var(--navy)]/60 mb-2">
              <span className="text-xs font-mono font-bold">Registered Medicos</span>
              <Users className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <span className="text-2xl font-serif font-black text-[var(--navy)]">
              {totalStudents}
            </span>
            <span className="text-[10px] font-mono text-[var(--navy)]/60 block mt-1">
              MongoDB Atlas users
            </span>
          </div>

          {/* Catalog Notes */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[var(--navy)] shadow-[4px_4px_0_var(--navy)]">
            <div className="flex items-center justify-between text-[var(--navy)]/60 mb-2">
              <span className="text-xs font-mono font-bold">Catalog Notes</span>
              <BookOpen className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <span className="text-2xl font-serif font-black text-[var(--navy)]">
              {totalNotes}
            </span>
            <span className="text-[10px] font-mono text-[var(--navy)]/60 block mt-1">
              Active notebooks
            </span>
          </div>
        </div>

        {/* Live Admin Dashboard Modules */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-3 border-[var(--navy)] shadow-[6px_6px_0_var(--navy)]">
          <AdminDashboardTabs />
        </div>
      </Container>
    </div>
  );
}

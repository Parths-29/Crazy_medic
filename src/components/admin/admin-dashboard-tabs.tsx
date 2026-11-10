"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, ShoppingBag, Tag, Users, Trash2, ShieldAlert, RotateCcw, CheckCircle2, XCircle, ExternalLink, Plus } from "lucide-react";
import { AdminNotesManager } from "./admin-notes-manager";

type TabKey = "notes" | "orders" | "coupons" | "users";

export function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("notes");

  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingTab, setLoadingTab] = useState(false);

  // Coupon creation inputs
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "flat">("percentage");
  const [newValue, setNewValue] = useState("15");

  const fetchTabData = async (tab: TabKey) => {
    if (tab === "notes") return;
    setLoadingTab(true);
    try {
      const res = await fetch(`/api/admin/${tab}`);
      if (res.ok) {
        const data = await res.json();
        if (tab === "orders") setOrders(data.orders || []);
        if (tab === "coupons") setCoupons(data.coupons || []);
        if (tab === "users") setUsers(data.users || []);
      }
    } catch (e) {
      console.error(`Failed to load ${tab}`, e);
    } finally {
      setLoadingTab(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newValue) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          type: newType,
          value: Number(newValue),
        }),
      });
      if (res.ok) {
        setNewCode("");
        fetchTabData("coupons");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create coupon");
      }
    } catch {
      alert("Network error creating coupon");
    }
  };

  const handleCouponAction = async (action: "toggle" | "delete", id: string) => {
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id }),
    });
    fetchTabData("coupons");
  };

  const handleUserAction = async (action: "reset_devices" | "toggle_block", userId: string) => {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId }),
    });
    fetchTabData("users");
  };

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 pb-6 border-b-2 border-[var(--navy)]/15">
        {[
          { key: "notes", label: "Notes & Catalog", icon: BookOpen },
          { key: "orders", label: "Orders & Receipts", icon: ShoppingBag },
          { key: "coupons", label: "Promo Coupons", icon: Tag },
          { key: "users", label: "Students & Devices", icon: Users },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as TabKey)}
              className={`px-4 py-2.5 rounded-xl border-2 border-[var(--navy)] text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                active
                  ? "bg-[var(--coral)] text-[var(--navy)] shadow-[3px_3px_0_var(--navy)]"
                  : "bg-[var(--cream)] hover:bg-black/5 text-[var(--navy)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      {activeTab === "notes" && <AdminNotesManager />}

      {activeTab === "orders" && (
        <div className="mt-6">
          <h2 className="font-serif font-black text-xl text-[var(--navy)] mb-4">
            Recent Storefront Orders
          </h2>
          {loadingTab ? (
            <p className="text-xs font-mono text-[var(--navy)]/60 py-8 text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs font-mono text-[var(--navy)]/60 py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[var(--navy)]">
                        #{ord._id.slice(-8).toUpperCase()}
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
                        {ord.items?.[0]?.title || "Notebook"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[var(--navy)]/65 mt-1">
                      {ord.email} • +91 {ord.phone} •{" "}
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-mono font-black text-base text-[var(--coral-ink)]">
                      ₹{Math.round((ord.amount || 0) / 100)}
                    </span>
                    {ord.status === "paid" && (
                      <a
                        href={`/api/invoice/${ord._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border-2 border-[var(--navy)] bg-white hover:bg-[var(--coral)] text-xs font-bold flex items-center gap-1 transition"
                      >
                        <span>Invoice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "coupons" && (
        <div className="mt-6">
          <h2 className="font-serif font-black text-xl text-[var(--navy)] mb-4">
            Create & Manage Discount Coupons
          </h2>

          <form
            onSubmit={handleCreateCoupon}
            className="p-4 rounded-xl border-2 border-[var(--navy)] bg-[var(--cream)]/50 mb-6 flex flex-wrap items-end gap-3"
          >
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="PROF20"
                className="px-3 py-2 text-xs font-mono border-2 border-[var(--navy)] rounded-lg bg-white uppercase w-36"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Discount Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as "percentage" | "flat")}
                className="px-3 py-2 text-xs font-mono border-2 border-[var(--navy)] rounded-lg bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Off (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Value</label>
              <input
                type="number"
                required
                min={1}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="px-3 py-2 text-xs font-mono border-2 border-[var(--navy)] rounded-lg bg-white w-24"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] text-xs font-bold shadow-[2px_2px_0_var(--navy)] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coupon</span>
            </button>
          </form>

          {loadingTab ? (
            <p className="text-xs font-mono text-[var(--navy)]/60 py-6 text-center">Loading coupons...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coupons.map((cp) => (
                <div
                  key={cp._id}
                  className="p-4 rounded-xl border-2 border-[var(--navy)] bg-white flex items-center justify-between shadow-[3px_3px_0_var(--navy)]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-[var(--navy)]">
                        {cp.code}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--coral)]/20 text-[var(--coral-ink)]">
                        {cp.type === "percentage" ? `${cp.value}% OFF` : `₹${cp.value} OFF`}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--navy)]/60 block mt-0.5">
                      Used {cp.currentUses} / {cp.maxUses} times
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCouponAction("toggle", cp._id)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold cursor-pointer ${
                        cp.active
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-gray-100 border-gray-300 text-gray-600"
                      }`}
                    >
                      {cp.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => handleCouponAction("delete", cp._id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="mt-6">
          <h2 className="font-serif font-black text-xl text-[var(--navy)] mb-4">
            Registered Medicos & Hardware Locks
          </h2>
          {loadingTab ? (
            <p className="text-xs font-mono text-[var(--navy)]/60 py-6 text-center">Loading users...</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="p-4 rounded-xl border-2 border-[var(--navy)] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-sm text-[var(--navy)]">
                        {u.name}
                      </span>
                      {u.role === "admin" && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--coral)] text-[var(--navy)]">
                          ADMIN
                        </span>
                      )}
                      {u.blocked && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-[var(--navy)]/65 mt-0.5">
                      {u.email} {u.phone ? `• +91 ${u.phone}` : ""} • Devices:{" "}
                      <strong>{u.devices?.length || 0} / 2</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleUserAction("reset_devices", u._id)}
                      className="px-3 py-1.5 rounded-lg border-2 border-[var(--navy)] bg-[var(--cream)] hover:bg-black/5 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Devices</span>
                    </button>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleUserAction("toggle_block", u._id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          u.blocked
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-red-300 bg-red-50 text-red-700"
                        }`}
                      >
                        {u.blocked ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Unblock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Block</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { Laptop, Smartphone, Tablet, Monitor, Trash2, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";

interface Device {
  deviceId: string;
  name: string;
  userAgent?: string;
  lastSeen: string;
  createdAt: string;
}

export function DevicesManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/devices");
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
        setCurrentDeviceId(data.currentDeviceId || "");
      }
    } catch (e) {
      console.error("Failed to load devices", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (deviceId: string) => {
    const isCurrent = deviceId === currentDeviceId;
    const confirmMsg = isCurrent
      ? "Revoking your current device will require you to log in again. Continue?"
      : "Revoke access for this device? It will be logged out of your notes library.";

    if (!confirm(confirmMsg)) return;

    setRevokingId(deviceId);
    try {
      const res = await fetch("/api/user/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke", deviceId }),
      });
      if (res.ok) {
        if (isCurrent) {
          window.location.reload();
        } else {
          setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
        }
      }
    } catch (err) {
      alert("Failed to revoke device");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Are you sure you want to log out all other devices?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_all" }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to revoke devices");
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("phone") || lower.includes("iphone")) {
      return <Smartphone className="w-5 h-5 text-[var(--coral)]" />;
    }
    if (lower.includes("ipad") || lower.includes("tablet")) {
      return <Tablet className="w-5 h-5 text-[var(--coral)]" />;
    }
    if (lower.includes("mac") || lower.includes("pc") || lower.includes("windows")) {
      return <Laptop className="w-5 h-5 text-[var(--coral)]" />;
    }
    return <Monitor className="w-5 h-5 text-[var(--coral)]" />;
  };

  return (
    <div className="mt-8 pt-6 border-t-2 border-[var(--navy)]/15">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-[var(--navy)] flex items-center gap-2">
            <span>Active Study Devices</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--coral)]/15 text-[var(--coral-ink)] border border-[var(--coral)]/30">
              {devices.length} / 2 Allowed
            </span>
          </h2>
          <p className="text-xs text-[var(--navy)]/65 font-sans mt-0.5">
            To prevent notes leakage and account sharing, access is locked to a maximum of 2 devices.
          </p>
        </div>

        <button
          onClick={fetchDevices}
          disabled={loading}
          aria-label="Refresh devices list"
          className="self-start sm:self-auto p-1.5 rounded-lg border border-[var(--navy)]/20 hover:bg-black/5 text-[var(--navy)]/70 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-xs font-mono text-[var(--navy)]/60">
          Loading authorized devices...
        </div>
      ) : devices.length === 0 ? (
        <div className="p-4 rounded-xl border-2 border-dashed border-[var(--navy)]/20 text-center text-xs text-[var(--navy)]/70">
          No registered devices found yet. Browsing this device will register it automatically.
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => {
            const isCurrent = device.deviceId === currentDeviceId;
            return (
              <div
                key={device.deviceId}
                className="p-3.5 sm:p-4 rounded-xl border-2 border-[var(--navy)] bg-white flex items-center justify-between gap-3 shadow-[3px_3px_0_var(--navy)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--cream)] border-2 border-[var(--navy)] flex items-center justify-center shrink-0">
                    {getDeviceIcon(device.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[var(--navy)]">
                        {device.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          This Device
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--navy)]/60 block mt-0.5">
                      Last seen: {new Date(device.lastSeen).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRevoke(device.deviceId)}
                  disabled={revokingId === device.deviceId}
                  className="px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Revoke</span>
                </button>
              </div>
            );
          })}

          {devices.length >= 2 && (
            <div className="p-3 rounded-xl bg-[var(--coral)]/10 border-2 border-[var(--coral)] text-xs text-[var(--navy)] flex items-start gap-2.5 mt-3">
              <ShieldAlert className="w-4 h-4 text-[var(--coral)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Device limit reached</span>
                <span>
                  You are at your 2-device maximum. To read notes on another phone, tablet, or laptop, revoke one of the devices above first.
                </span>
              </div>
            </div>
          )}

          {devices.length > 1 && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleRevokeAll}
                className="text-xs font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 transition cursor-pointer"
              >
                Log out all devices
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


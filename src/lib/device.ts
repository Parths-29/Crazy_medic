import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User, IUser, IDevice } from "@/models/User";

const DEVICE_COOKIE_NAME = "cm_device_id";
export const MAX_DEVICES_PER_USER = 2;

export async function getOrCreateDeviceId(): Promise<string> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(DEVICE_COOKIE_NAME)?.value;

  if (existingId && existingId.length >= 16) {
    return existingId;
  }

  const newId = `dev_${crypto.randomBytes(16).toString("hex")}`;
  cookieStore.set(DEVICE_COOKIE_NAME, newId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
  });

  return newId;
}

export function parseDeviceName(userAgent: string): string {
  if (!userAgent) return "Unknown Device";
  if (/iPad/i.test(userAgent)) return "Apple iPad";
  if (/iPhone/i.test(userAgent)) return "Apple iPhone";
  if (/Android/i.test(userAgent)) {
    if (/Mobile/i.test(userAgent)) return "Android Phone";
    return "Android Tablet";
  }
  if (/Macintosh/i.test(userAgent)) return "Apple Mac";
  if (/Windows/i.test(userAgent)) return "Windows PC";
  if (/Linux/i.test(userAgent)) return "Linux Device";
  return "Web Browser";
}

export interface DeviceCheckResult {
  allowed: boolean;
  deviceId: string;
  devices: IDevice[];
  error?: string;
}

export async function verifyAndRegisterDevice(userId: string): Promise<DeviceCheckResult> {
  await connectDB();
  const deviceId = await getOrCreateDeviceId();
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const deviceName = parseDeviceName(userAgent);

  const user = await User.findById(userId);
  if (!user) {
    return { allowed: false, deviceId, devices: [], error: "User not found" };
  }

  // Ensure devices array exists
  if (!user.devices) {
    user.devices = [];
  }

  const existingDeviceIndex = user.devices.findIndex((d) => d.deviceId === deviceId);

  if (existingDeviceIndex !== -1) {
    // Known device - update last seen timestamp
    user.devices[existingDeviceIndex].lastSeen = new Date();
    user.devices[existingDeviceIndex].userAgent = userAgent;
    await user.save();
    return { allowed: true, deviceId, devices: user.devices };
  }

  // New device: check if user already has maximum active devices (2)
  if (user.devices.length >= MAX_DEVICES_PER_USER) {
    return {
      allowed: false,
      deviceId,
      devices: user.devices,
      error: `Device limit reached. You can only access your study notes from ${MAX_DEVICES_PER_USER} devices simultaneously. Please revoke an old device from your profile to continue.`,
    };
  }

  // Under limit: register new device
  const newDevice: IDevice = {
    deviceId,
    name: deviceName,
    userAgent,
    lastSeen: new Date(),
    createdAt: new Date(),
  };

  user.devices.push(newDevice);
  await user.save();

  return { allowed: true, deviceId, devices: user.devices };
}

export async function revokeUserDevice(userId: string, targetDeviceId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user || !user.devices) return false;

  user.devices = user.devices.filter((d) => d.deviceId !== targetDeviceId);
  await user.save();
  return true;
}

export async function revokeAllUserDevices(userId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return false;

  user.devices = [];
  await user.save();
  return true;
}


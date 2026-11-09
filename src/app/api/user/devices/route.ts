import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getOrCreateDeviceId, revokeUserDevice, revokeAllUserDevices, MAX_DEVICES_PER_USER } from "@/lib/device";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentDeviceId = await getOrCreateDeviceId();

  return NextResponse.json({
    currentDeviceId,
    maxDevices: MAX_DEVICES_PER_USER,
    devices: user.devices || [],
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { action, deviceId } = body;

  if (action === "revoke" && deviceId) {
    const success = await revokeUserDevice(session.user.id, deviceId);
    return NextResponse.json({ success });
  }

  if (action === "revoke_all") {
    const success = await revokeAllUserDevices(session.user.id);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
}


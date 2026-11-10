import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const users = await User.find({})
    .select("name email phone role blocked emailVerified phoneVerified devices createdAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { action, userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (action === "reset_devices") {
      user.devices = [];
      await user.save();
      return NextResponse.json({ success: true, user });
    }

    if (action === "toggle_block") {
      if (user.role === "admin") {
        return NextResponse.json({ error: "Cannot block an admin user" }, { status: 400 });
      }
      user.blocked = !user.blocked;
      await user.save();
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error updating user" }, { status: 500 });
  }
}

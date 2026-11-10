import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ orders });
}


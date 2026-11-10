import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, id, code, type, value, maxUses } = body;
    await connectDB();

    if (action === "toggle" && id) {
      const coupon = await Coupon.findById(id);
      if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
      coupon.active = !coupon.active;
      await coupon.save();
      return NextResponse.json({ success: true, coupon });
    }

    if (action === "delete" && id) {
      await Coupon.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    if (!code || !value) {
      return NextResponse.json({ error: "Code and value are required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const exists = await Coupon.findOne({ code: cleanCode });
    if (exists) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const created = await Coupon.create({
      code: cleanCode,
      type: type === "flat" ? "flat" : "percentage",
      value: Number(value),
      maxUses: Number(maxUses) || 100,
      active: true,
    });

    return NextResponse.json({ success: true, coupon: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Coupon error" }, { status: 500 });
  }
}


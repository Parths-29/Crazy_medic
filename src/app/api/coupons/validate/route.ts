import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const { code, amountPaise } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    await connectDB();

    let coupon = await Coupon.findOne({ code: cleanCode, active: true });

    // Seed built-in starter code if user tests MEDICO10
    if (!coupon && cleanCode === "MEDICO10") {
      coupon = await Coupon.create({
        code: "MEDICO10",
        type: "percentage",
        value: 10,
        maxUses: 1000,
        active: true,
      });
    }

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    const baseAmount = Number(amountPaise) || 0;
    let discountPaise = 0;

    if (coupon.type === "percentage") {
      discountPaise = Math.round((baseAmount * coupon.value) / 100);
    } else {
      discountPaise = Math.min(baseAmount, coupon.value * 100);
    }

    const finalAmountPaise = Math.max(100, baseAmount - discountPaise);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountPaise,
      finalAmountPaise,
    });
  } catch (err: any) {
    console.error("Coupon validation error:", err);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}


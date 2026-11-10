import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { Order } from "@/models/Order";
import { Coupon } from "@/models/Coupon";
import { auth } from "@/lib/auth";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { createRazorpayOrder } from "@/lib/razorpay";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { noteSlug, email, phone, couponCode, utm } = body;

    if (!email || !phone) {
      return NextResponse.json({ error: "Email and 10-digit phone number are required" }, { status: 400 });
    }

    // Anti-fake disposable email guard
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Temporary and disposable email addresses are not allowed for notes licensing." },
        { status: 400 }
      );
    }

    // Phone format check (10 digits Indian)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    await connectDB();
    const session = await auth();
    const cleanEmail = email.toLowerCase().trim();

    // Prevent accidental duplicate purchase for already paid note
    const existingPaid = await Order.findOne({
      email: cleanEmail,
      status: "paid",
      "items.slug": noteSlug,
    });
    if (existingPaid) {
      return NextResponse.json(
        {
          error: "You already own this notebook! Open your Study Library to read it.",
          alreadyOwned: true,
          existingOrderId: existingPaid._id,
        },
        { status: 409 }
      );
    }

    // Find note in DB or fallback to MOCK_NOTEBOOKS
    const note = await Note.findOne({ slug: noteSlug });
    let pricePaise = 29900;
    let title = "Handwritten Medical Notes";
    let pdfKey = `notes/${noteSlug}.pdf`;

    if (note) {
      pricePaise = note.price;
      title = note.title;
      pdfKey = note.pdfKey || pdfKey;
    } else {
      const mock = MOCK_NOTEBOOKS.find((m) => m.slug === noteSlug || m.id === noteSlug);
      if (mock) {
        pricePaise = mock.price * 100;
        title = mock.title;
      }
    }

    // Apply server-computed coupon discount if valid
    let finalAmountPaise = pricePaise;
    if (couponCode && typeof couponCode === "string") {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), active: true });
      if (coupon && coupon.currentUses < coupon.maxUses && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        const discountPaise =
          coupon.type === "percentage"
            ? Math.round((pricePaise * coupon.value) / 100)
            : Math.min(pricePaise, coupon.value * 100);
        finalAmountPaise = Math.max(100, pricePaise - discountPaise);
        coupon.currentUses += 1;
        await coupon.save();
      }
    }

    // Create MongoDB Order
    const order = await Order.create({
      userId: session?.user?.id || undefined,
      email: cleanEmail,
      phone: cleanPhone,
      items: [
        {
          noteId: note?._id || undefined,
          slug: noteSlug,
          title,
          price: finalAmountPaise,
          pdfKey,
        },
      ],
      amount: finalAmountPaise,
      currency: "INR",
      status: "created",
      utm,
    });

    // Create Razorpay Order
    const rzpOrder = await createRazorpayOrder({
      amountPaise: finalAmountPaise,
      receipt: `rcpt_${order._id.toString().substring(0, 10)}`,
      notes: {
        orderId: order._id.toString(),
        noteSlug,
        studentEmail: cleanEmail,
        studentPhone: cleanPhone,
      },
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: finalAmountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (err: any) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}

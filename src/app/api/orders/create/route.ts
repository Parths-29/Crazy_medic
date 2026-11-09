import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { Order } from "@/models/Order";
import { auth } from "@/lib/auth";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { createRazorpayOrder } from "@/lib/razorpay";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { noteSlug, email, phone, utm } = body;

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

    // Find note in DB or fallback to MOCK_NOTEBOOKS
    let note = await Note.findOne({ slug: noteSlug });
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

    // Create MongoDB Order
    const order = await Order.create({
      userId: session?.user?.id || undefined,
      email: email.toLowerCase().trim(),
      phone: cleanPhone,
      items: [
        {
          noteId: note?._id || undefined,
          slug: noteSlug,
          title,
          price: pricePaise,
          pdfKey,
        },
      ],
      amount: pricePaise,
      currency: "INR",
      status: "created",
      utm,
    });

    // Create Razorpay Order
    const rzpOrder = await createRazorpayOrder({
      amountPaise: pricePaise,
      receipt: `rcpt_${order._id.toString().substring(0, 10)}`,
      notes: {
        orderId: order._id.toString(),
        noteSlug,
        studentEmail: email,
        studentPhone: cleanPhone,
      },
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: pricePaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (err: any) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}

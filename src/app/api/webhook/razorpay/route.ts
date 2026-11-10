import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    const paymentEntity = event?.payload?.payment?.entity;

    if (!paymentEntity?.order_id) {
      return NextResponse.json({ received: true });
    }

    await connectDB();
    const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
    if (!order) {
      return NextResponse.json({ received: true, status: "order_not_found" });
    }

    if (eventType === "payment.captured") {
      // Idempotency: only process if not already paid
      if (order.status !== "paid") {
        order.status = "paid";
        order.razorpayPaymentId = paymentEntity.id;
        await order.save();

        // Ensure student account exists and is verified
        let user = await User.findOne({
          $or: [{ email: order.email }, { phone: order.phone }],
        });
        if (!user) {
          user = await User.create({
            name: `Medico ${order.phone.slice(-4)}`,
            email: order.email,
            phone: order.phone,
            phoneVerified: true,
            emailVerified: new Date(),
            role: "user",
          });
        }
        if (!order.userId && user) {
          order.userId = user._id;
          await order.save();
        }
      }
    } else if (eventType === "payment.failed") {
      if (order.status === "created") {
        order.status = "failed";
        await order.save();
      }
    }

    return NextResponse.json({ received: true, orderId: order._id, status: order.status });
  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}


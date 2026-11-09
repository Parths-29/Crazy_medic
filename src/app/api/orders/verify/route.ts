import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { verifyAndRegisterDevice } from "@/lib/device";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId) {
      return NextResponse.json({ error: "Missing required order verification parameters" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify HMAC signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId || "mock_payment_id",
      signature: razorpaySignature || "mock_signature",
    });

    if (!isValid) {
      order.status = "failed";
      await order.save();
      return NextResponse.json({ error: "Invalid payment signature verification" }, { status: 400 });
    }

    order.status = "paid";
    order.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
    order.razorpaySignature = razorpaySignature || "verified_sig";
    await order.save();

    // Link or create user by phone/email
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
    } else {
      if (!user.phone) user.phone = order.phone;
      user.phoneVerified = true;
      await user.save();
    }

    // Register this student's device automatically
    await verifyAndRegisterDevice(user._id.toString());

    return NextResponse.json({
      success: true,
      orderId: order._id,
      noteTitle: order.items[0]?.title || "Handwritten Medical Notes",
      downloadUrl: `/api/orders/${order._id}/download`,
    });
  } catch (err: any) {
    console.error("Order verification failed:", err);
    return NextResponse.json({ error: err.message || "Failed to verify order" }, { status: 500 });
  }
}


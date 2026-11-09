import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { OtpToken } from "@/models/OtpToken";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone number and OTP code are required" }, { status: 400 });
    }

    const cleaned = String(phone).replace(/\D/g, "");
    const sanitizedPhone = cleaned.length === 12 && cleaned.startsWith("91")
      ? cleaned.slice(2)
      : cleaned;

    const trimmedOtp = String(otp).trim();

    await connectDB();

    const record = await OtpToken.findOne({ phone: sanitizedPhone });
    if (!record) {
      return NextResponse.json(
        { error: "OTP expired or not requested. Please request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(record.expires)) {
      await OtpToken.deleteOne({ _id: record._id });
      return NextResponse.json(
        { error: "This OTP has expired. Please request a fresh code." },
        { status: 400 }
      );
    }

    if (record.attempts >= 3) {
      await OtpToken.deleteOne({ _id: record._id });
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    const hashedInput = crypto.createHash("sha256").update(trimmedOtp).digest("hex");
    if (hashedInput !== record.hashedOtp) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      const remainingTries = 3 - record.attempts;
      return NextResponse.json(
        { error: `Incorrect OTP code. ${remainingTries} attempt${remainingTries === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      );
    }

    // OTP Verified successfully! Clean up token record
    await OtpToken.deleteOne({ _id: record._id });

    // Check if a user session is active (for phone linking)
    const session = await auth();
    let linkedUserId: string | null = null;

    if (session?.user?.id) {
      // Link verified phone to logged-in user
      const user = await User.findById(session.user.id);
      if (user) {
        user.phone = sanitizedPhone;
        user.phoneVerified = true;
        if (!user.providers.includes("phone")) {
          user.providers.push("phone");
        }
        await user.save();
        linkedUserId = user._id.toString();
      }
    } else {
      // Find or create user with this verified phone
      let user = await User.findOne({ phone: sanitizedPhone });
      if (user) {
        user.phoneVerified = true;
        if (!user.providers.includes("phone")) {
          user.providers.push("phone");
        }
        await user.save();
        linkedUserId = user._id.toString();
      } else {
        // Auto-provision verified phone user
        const newUser = await User.create({
          name: `Student +91${sanitizedPhone.slice(-4)}`,
          email: `phone_${sanitizedPhone}@crazymedic.internal`,
          phone: sanitizedPhone,
          phoneVerified: true,
          providers: ["phone"],
          role: "user",
        });
        linkedUserId = newUser._id.toString();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      phone: sanitizedPhone,
      userId: linkedUserId,
    });
  } catch (error: any) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify OTP" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { OtpToken } from "@/models/OtpToken";
import { smsProvider } from "@/lib/sms-providers/msg91";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, honeypot } = body;

    // Honeypot anti-bot check
    if (honeypot) {
      return NextResponse.json({ success: true, message: "OTP sent" });
    }

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Sanitize phone to pure 10 digits
    const cleaned = String(phone).replace(/\D/g, "");
    const sanitizedPhone = cleaned.length === 12 && cleaned.startsWith("91")
      ? cleaned.slice(2)
      : cleaned;

    if (!/^[6-9]\d{9}$/.test(sanitizedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check rate limit & 60-second cooldown
    const existing = await OtpToken.findOne({ phone: sanitizedPhone });
    if (existing && existing.lastSentAt) {
      const elapsedSeconds = (Date.now() - new Date(existing.lastSentAt).getTime()) / 1000;
      if (elapsedSeconds < 60) {
        const remaining = Math.ceil(60 - elapsedSeconds);
        return NextResponse.json(
          { error: `Please wait ${remaining} seconds before requesting a new code.` },
          { status: 429 }
        );
      }
    }

    // Generate secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

    // Upsert into OtpToken collection
    await OtpToken.findOneAndUpdate(
      { phone: sanitizedPhone },
      {
        phone: sanitizedPhone,
        hashedOtp,
        attempts: 0,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5 mins TTL
        lastSentAt: new Date(),
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Dispatch via SMS Provider (MSG91 or Dev Simulator)
    const smsResult = await smsProvider.sendOtp({ phone: sanitizedPhone, otp: rawOtp });

    if (!smsResult.success) {
      return NextResponse.json(
        { error: smsResult.error || "Failed to deliver SMS. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "6-digit OTP sent to your phone number",
      // Include dev OTP for instant developer testing when keys are unconfigured
      ...(process.env.NODE_ENV !== "production" && { devOtp: rawOtp }),
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}


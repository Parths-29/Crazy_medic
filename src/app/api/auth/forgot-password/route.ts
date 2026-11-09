import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { VerificationToken } from "@/models/VerificationToken";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond with success to prevent user enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email exists in our system, a password reset link has been dispatched.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await VerificationToken.create({
      identifier: user.email,
      token,
      type: "password-reset",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    return NextResponse.json({
      success: true,
      message: "If that email exists in our system, a password reset link has been dispatched.",
      resetUrlDev: resetUrl, // provided for dev test convenience
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}


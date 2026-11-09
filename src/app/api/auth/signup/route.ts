import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { VerificationToken } from "@/models/VerificationToken";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const isFirstAdmin = adminEmails.includes(normalizedEmail);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: isFirstAdmin ? "admin" : "user",
      providers: ["credentials"],
      emailVerified: null,
    });

    // Create email verification token
    const token = crypto.randomBytes(32).toString("hex");
    await VerificationToken.create({
      identifier: normalizedEmail,
      token,
      type: "email-verify",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Verification link (in production, sent via Resend)
    const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`;

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      verifyUrlDev: verifyUrl, // surfaced in response for testing
      userId: user._id,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 });
  }
}


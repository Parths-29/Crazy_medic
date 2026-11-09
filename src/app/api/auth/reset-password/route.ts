import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { VerificationToken } from "@/models/VerificationToken";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();
    const record = await VerificationToken.findOne({
      token,
      type: "password-reset",
      expires: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);

    await User.findOneAndUpdate(
      { email: record.identifier },
      { $set: { passwordHash } }
    );

    await VerificationToken.deleteOne({ _id: record._id });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 500 });
  }
}


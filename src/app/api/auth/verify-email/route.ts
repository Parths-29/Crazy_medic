import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { VerificationToken } from "@/models/VerificationToken";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
    }

    await connectDB();
    const record = await VerificationToken.findOne({
      token,
      type: "email-verify",
      expires: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    await User.findOneAndUpdate(
      { email: record.identifier },
      { $set: { emailVerified: new Date() } }
    );

    await VerificationToken.deleteOne({ _id: record._id });

    return NextResponse.json({
      success: true,
      message: "Email successfully verified! You can now log in.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}


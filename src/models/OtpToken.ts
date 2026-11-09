import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpToken extends Document {
  phone: string;
  hashedOtp: string;
  attempts: number;
  expires: Date;
  lastSentAt: Date;
  createdAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>({
  phone: { type: String, required: true, index: true },
  hashedOtp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expires: { type: Date, required: true },
  lastSentAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// TTL index to automatically delete expired OTPs from the database
OtpTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const OtpToken: Model<IOtpToken> =
  mongoose.models.OtpToken || mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);


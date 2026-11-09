import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerificationToken extends Document {
  identifier: string; // email
  token: string;
  type: "email-verify" | "password-reset";
  expires: Date;
  createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  type: { type: String, enum: ["email-verify", "password-reset"], required: true },
  expires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// TTL index to automatically purge expired tokens
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken: Model<IVerificationToken> =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);


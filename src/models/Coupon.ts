import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "percentage" | "flat";
  value: number; // percentage (e.g. 20) or flat amount in rupees (e.g. 50)
  expiresAt?: Date | null;
  maxUses: number;
  currentUses: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    value: { type: Number, required: true, min: 1 },
    expiresAt: { type: Date, default: null },
    maxUses: { type: Number, default: 100 },
    currentUses: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);


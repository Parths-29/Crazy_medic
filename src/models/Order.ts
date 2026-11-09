import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  noteId?: mongoose.Types.ObjectId;
  slug?: string;
  title: string;
  price: number; // in paise
  pdfKey?: string;
}

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  email: string;
  phone: string;
  items: IOrderItem[];
  amount: number; // in paise
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: "created" | "paid" | "failed";
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  noteId: { type: Schema.Types.ObjectId, ref: "Note", required: false },
  slug: { type: String },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  pdfKey: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    items: { type: [OrderItemSchema], default: [] },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    utm: {
      source: { type: String },
      medium: { type: String },
      campaign: { type: String },
    },
  },
  { timestamps: true }
);

OrderSchema.index({ email: 1 });
OrderSchema.index({ phone: 1 });
OrderSchema.index({ status: 1 });

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

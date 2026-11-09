import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDevice {
  deviceId: string;
  name?: string;
  userAgent?: string;
  lastSeen: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date | null;
  phone?: string | null;
  phoneVerified?: boolean;
  passwordHash?: string | null;
  image?: string | null;
  role: "user" | "admin";
  providers: string[];
  blocked: boolean;
  devices: IDevice[];
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>({
  deviceId: { type: String, required: true },
  name: { type: String },
  userAgent: { type: String },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    phone: { type: String, default: null, trim: true },
    phoneVerified: { type: Boolean, default: false },
    passwordHash: { type: String, default: null },
    image: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    providers: { type: [String], default: ["credentials"] },
    blocked: { type: Boolean, default: false },
    devices: { type: [DeviceSchema], default: [] },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  title: string;
  slug: string;
  description: string;
  subject: string;
  category: string;
  yearTag: string;
  price: number; // in paise
  mrp: number; // in paise
  coverUrl?: string;
  pdfKey?: string;
  samplePages: number;
  sampleImages: string[];
  tags: string[];
  whatsInside: string[];
  rating: number;
  ratingCount: number;
  studentsBought: number;
  featured: boolean;
  published: boolean;
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    yearTag: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    coverUrl: { type: String },
    pdfKey: { type: String },
    samplePages: { type: Number, default: 3 },
    sampleImages: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    whatsInside: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    studentsBought: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    color: { type: String, default: "#E8443A" },
  },
  { timestamps: true }
);

NoteSchema.index({ slug: 1 }, { unique: true });
NoteSchema.index({ category: 1, published: 1 });
NoteSchema.index({ featured: 1, published: 1 });

export const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);


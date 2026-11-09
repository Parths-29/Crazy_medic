import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  await connectDB();
  const notes = await Note.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      subject,
      category,
      yearTag,
      price,
      mrp,
      coverUrl,
      pdfKey,
      samplePages,
      tags,
      whatsInside,
      color,
      featured,
      published,
    } = body;

    if (!title || !slug || !description || !subject || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, description, subject, price" },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await Note.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A note with this slug already exists" }, { status: 409 });
    }

    const note = await Note.create({
      title,
      slug: slug.toLowerCase().trim(),
      description,
      subject,
      category: category || "General Medicine",
      yearTag: yearTag || "Prof 2",
      price: Math.round(Number(price) * 100), // convert rupees to paise
      mrp: Math.round(Number(mrp || price) * 100),
      coverUrl: coverUrl || "",
      pdfKey: pdfKey || "",
      samplePages: Number(samplePages) || 3,
      tags: Array.isArray(tags) ? tags : [],
      whatsInside: Array.isArray(whatsInside) ? whatsInside : [],
      color: color || "#FF6F59",
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create note:", err);
    return NextResponse.json({ error: err.message || "Failed to create note" }, { status: 500 });
  }
}


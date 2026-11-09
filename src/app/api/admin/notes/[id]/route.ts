import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    await connectDB();

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (body.title !== undefined) note.title = body.title;
    if (body.slug !== undefined) note.slug = body.slug.toLowerCase().trim();
    if (body.description !== undefined) note.description = body.description;
    if (body.subject !== undefined) note.subject = body.subject;
    if (body.category !== undefined) note.category = body.category;
    if (body.yearTag !== undefined) note.yearTag = body.yearTag;
    if (body.price !== undefined) note.price = Math.round(Number(body.price) * 100);
    if (body.mrp !== undefined) note.mrp = Math.round(Number(body.mrp) * 100);
    if (body.coverUrl !== undefined) note.coverUrl = body.coverUrl;
    if (body.pdfKey !== undefined) note.pdfKey = body.pdfKey;
    if (body.samplePages !== undefined) note.samplePages = Number(body.samplePages);
    if (body.tags !== undefined) note.tags = body.tags;
    if (body.whatsInside !== undefined) note.whatsInside = body.whatsInside;
    if (body.color !== undefined) note.color = body.color;
    if (body.featured !== undefined) note.featured = Boolean(body.featured);
    if (body.published !== undefined) note.published = Boolean(body.published);
    if (body.order !== undefined) note.order = Number(body.order);

    await note.save();
    return NextResponse.json({ success: true, note });
  } catch (err: any) {
    console.error("Failed to update note:", err);
    return NextResponse.json({ error: err.message || "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await connectDB();
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete note:", err);
    return NextResponse.json({ error: err.message || "Failed to delete note" }, { status: 500 });
  }
}


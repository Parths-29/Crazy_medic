import { NextResponse } from "next/server";
import { seedNotes } from "@/seed/seed";

export async function GET() {
  try {
    await seedNotes();
    return NextResponse.json({ success: true, message: "Database seeded with sample notes!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


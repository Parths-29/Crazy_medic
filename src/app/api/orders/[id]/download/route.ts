import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { watermarkPdf } from "@/lib/watermark";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "paid") {
      return NextResponse.json({ error: "Order is not paid" }, { status: 403 });
    }

    // Resolve student display name
    let studentName = `Dr. ${order.phone.slice(-4)}`;
    if (order.userId) {
      const user = await User.findById(order.userId);
      if (user?.name) studentName = user.name;
    }

    // Generate starter PDF template with high-yield clinical content
    const baseDoc = await PDFDocument.create();
    const timesRoman = await baseDoc.embedFont(StandardFonts.TimesRomanBold);
    const helvetica = await baseDoc.embedFont(StandardFonts.Helvetica);

    // Page 1: Cover & High Yield Summary
    const page1 = baseDoc.addPage([595.28, 841.89]); // A4
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: rgb(0.96, 0.93, 0.87), // warm cream
    });

    page1.drawText("THE CRAZY MEDIC", {
      x: 50,
      y: 770,
      size: 14,
      font: timesRoman,
      color: rgb(0.73, 0.2, 0.13), // coral ink
    });

    page1.drawText(order.items[0]?.title || "High-Yield Medical Handwritten Notes", {
      x: 50,
      y: 730,
      size: 24,
      font: timesRoman,
      color: rgb(0.08, 0.1, 0.18), // navy
    });

    page1.drawText("Curated by Parth • MBBS High-Yield Series", {
      x: 50,
      y: 700,
      size: 11,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.25),
    });

    page1.drawLine({
      start: { x: 50, y: 680 },
      end: { x: 545, y: 680 },
      thickness: 1.5,
      color: rgb(0.08, 0.1, 0.18),
    });

    page1.drawText("Clinical Chapter 1: Diagnostic Flowcharts & High-Yield Pearls", {
      x: 50,
      y: 640,
      size: 14,
      font: timesRoman,
      color: rgb(0.08, 0.1, 0.18),
    });

    const bodyParagraphs = [
      "1. Pathophysiology and Differential Diagnosis Protocols",
      "All surgical presentations require immediate hemodynamic assessment before imaging.",
      "Evaluate vital stability: BP, pulse volume, respiratory rate, GCS score.",
      "Standard emergency labs: CBC, Type and Screen, ABG with serum lactate.",
      "",
      "2. Treatment Algorithm & Drug Dosages",
      "Empiric coverage: Broad-spectrum IV cephalosporin + metronidazole within 1 hour.",
      "Continuous cardiac telemetry and hourly urine output via Foley catheter (target > 0.5 mL/kg/h).",
      "Immediate surgical consultation indicated if peritoneal signs or free air under diaphragm.",
    ];

    let currentY = 600;
    for (const line of bodyParagraphs) {
      if (line === "") {
        currentY -= 12;
        continue;
      }
      page1.drawText(line, {
        x: 50,
        y: currentY,
        size: 11,
        font: helvetica,
        color: rgb(0.12, 0.14, 0.2),
      });
      currentY -= 22;
    }

    // Page 2: Clinical Summary & Exam Pearls
    const page2 = baseDoc.addPage([595.28, 841.89]);
    page2.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: rgb(0.96, 0.93, 0.87),
    });

    page2.drawText("Chapter 2: High-Yield University Exam Questions & Answers", {
      x: 50,
      y: 770,
      size: 15,
      font: timesRoman,
      color: rgb(0.08, 0.1, 0.18),
    });

    page2.drawText(
      "Review this spread before your university practical viva and prof examinations.",
      {
        x: 50,
        y: 740,
        size: 11,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.35),
      }
    );

    const rawBytes = await baseDoc.save();

    // Dynamically apply anti-piracy forensic watermark
    const watermarkedBytes = await watermarkPdf(rawBytes, {
      name: studentName,
      email: order.email,
      phone: order.phone,
      orderId: order._id.toString(),
      licenseDate: new Date(order.createdAt).toISOString().split("T")[0],
    });

    const safeTitle = (order.items[0]?.title || "crazy-medic-notes")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    return new Response(Buffer.from(watermarkedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeTitle}-licensed.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("PDF download failed:", err);
    return NextResponse.json({ error: err.message || "Failed to download PDF" }, { status: 500 });
  }
}


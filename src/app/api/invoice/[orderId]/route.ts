import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    await connectDB();

    const order = await Order.findById(orderId).lean();
    if (!order || order.status !== "paid") {
      return new NextResponse("Paid order invoice not found", { status: 404 });
    }

    const amountRupees = Math.round((order.amount || 0) / 100);
    const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${orderId.slice(-8).toUpperCase()} — The Crazy Medic</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #F5EEDF; color: #141A2E; padding: 40px 20px; margin: 0; }
    .card { max-width: 680px; margin: 0 auto; background: #fff; border: 3px solid #141A2E; border-radius: 16px; padding: 36px; box-shadow: 6px 6px 0 #141A2E; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #141A2E; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-family: Georgia, serif; font-size: 24px; font-weight: 900; margin: 0; }
    .sub { font-size: 12px; color: #555; margin-top: 4px; }
    .badge { background: #FF6F59; color: #141A2E; font-weight: 800; font-size: 11px; padding: 4px 10px; border: 2px solid #141A2E; border-radius: 6px; text-transform: uppercase; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; font-size: 13px; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 700; display: block; margin-bottom: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #ddd; font-size: 14px; }
    th { font-size: 11px; text-transform: uppercase; color: #666; border-bottom: 2px solid #141A2E; }
    .total-row { font-size: 18px; font-weight: 900; }
    .actions { text-align: center; margin-top: 24px; }
    .btn { background: #FF6F59; color: #141A2E; border: 2px solid #141A2E; padding: 10px 22px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 3px 3px 0 #141A2E; }
    @media print { body { background: #fff; padding: 0; } .card { box-shadow: none; border: 1px solid #141A2E; } .actions { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 class="brand">The Crazy Medic</h1>
        <div class="sub">by Vismay Sharma • Digital Study Notes Receipt</div>
      </div>
      <span class="badge">PAID INVOICE</span>
    </div>
    <div class="meta">
      <div>
        <span class="meta-label">Billed To</span>
        <strong>${order.email}</strong><br />
        +91 ${order.phone}
      </div>
      <div style="text-align: right;">
        <span class="meta-label">Receipt Details</span>
        Order: <strong>#${orderId.slice(-8).toUpperCase()}</strong><br />
        Date: ${dateStr}<br />
        Ref: ${order.razorpayPaymentId || "Verified"}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Notebook / Digital License</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${order.items[0]?.title || "Handwritten Study Notes"}</strong><br />
            <span style="font-size: 12px; color: #555;">Forensic Watermarked PDF • 2-Device License</span>
          </td>
          <td style="text-align: right;">₹${amountRupees} INR</td>
        </tr>
        <tr class="total-row">
          <td>Total Paid</td>
          <td style="text-align: right;">₹${amountRupees} INR</td>
        </tr>
      </tbody>
    </table>
    <div style="font-size: 11px; color: #666; border-top: 1px dashed #ccc; padding-top: 14px;">
      This is a computer-generated receipt for digital study material licensed under The Crazy Medic.
      For support, open your Study Library or contact support@thecrazymedic.in.
    </div>
    <div class="actions">
      <button class="btn" onclick="window.print()">Print / Save Receipt as PDF</button>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new NextResponse("Error generating invoice", { status: 500 });
  }
}

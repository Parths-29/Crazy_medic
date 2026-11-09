import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface StudentLicenseInfo {
  name: string;
  email: string;
  phone: string;
  orderId: string;
  licenseDate?: string;
}

/**
 * Dynamically stamps anti-piracy watermarks and student identity onto every page of a PDF.
 * Never stores plain unwatermarked PDFs in the client's cache.
 */
export async function watermarkPdf(
  rawPdfBytes: Buffer | Uint8Array,
  student: StudentLicenseInfo
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(rawPdfBytes);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const dateStr = student.licenseDate || new Date().toISOString().split("T")[0];
  const diagonalText = `${student.name.toUpperCase()} • +91 ${student.phone} • THE CRAZY MEDIC`;
  const footerText = `Licensed to ${student.name} (${student.email} | +91 ${student.phone}) • Order: ${student.orderId} • ${dateStr} • Do not redistribute`;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    // 1. Diagonal Watermark in Center (Anti-leak forensic stamping)
    page.drawText(diagonalText, {
      x: width * 0.15,
      y: height * 0.45,
      size: Math.max(16, width * 0.028),
      font: fontBold,
      color: rgb(0.08, 0.1, 0.18), // var(--navy)
      opacity: 0.1,
      rotate: degrees(35),
    });

    page.drawText(diagonalText, {
      x: width * 0.2,
      y: height * 0.7,
      size: Math.max(14, width * 0.024),
      font: fontHelvetica,
      color: rgb(0.08, 0.1, 0.18),
      opacity: 0.08,
      rotate: degrees(35),
    });

    // 2. Top Header Bar Notice
    page.drawText("THE CRAZY MEDIC — VERIFIED STUDY NOTES", {
      x: 36,
      y: height - 24,
      size: 8,
      font: fontBold,
      color: rgb(0.73, 0.2, 0.13), // coral ink
      opacity: 0.75,
    });

    // 3. Bottom Footer Security Line
    page.drawText(footerText, {
      x: 36,
      y: 18,
      size: 7.5,
      font: fontHelvetica,
      color: rgb(0.15, 0.15, 0.15),
      opacity: 0.65,
    });

    // 4. Page numbering on right
    page.drawText(`Page ${i + 1} of ${pages.length}`, {
      x: width - 90,
      y: 18,
      size: 7.5,
      font: fontHelvetica,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
  }

  return await pdfDoc.save();
}


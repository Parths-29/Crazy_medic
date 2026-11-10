import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://thecrazymedic.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/stage", "/notes", "/notes/", "/about", "/contact"],
        disallow: ["/admin", "/api/", "/viewer/", "/library", "/profile"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

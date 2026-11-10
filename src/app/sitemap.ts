import type { MetadataRoute } from "next";
import { MOCK_NOTEBOOKS } from "@/components/notebook/notebook-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://thecrazymedic.vercel.app";

  const staticRoutes = [
    "",
    "/stage",
    "/notes",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refund-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/stage" || route === "/notes" ? 0.9 : 0.6,
  }));

  const productRoutes = MOCK_NOTEBOOKS.map((nb) => ({
    url: `${baseUrl}/notes/${nb.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}


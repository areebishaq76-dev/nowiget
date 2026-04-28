import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explain/", "/today", "/privacy", "/terms"],
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://nowiget.vercel.app/sitemap.xml",
  };
}

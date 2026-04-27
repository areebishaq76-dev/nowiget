import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";

const BASE_URL = "https://nowiget.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/today`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // All explanation pages
  const { data } = await supabase
    .from("explanations")
    .select("slug, created_at")
    .eq("reported", false)
    .order("created_at", { ascending: false })
    .limit(5000);

  const explanationPages: MetadataRoute.Sitemap = (data || []).map((row) => ({
    url: `${BASE_URL}/explain/${row.slug}`,
    lastModified: new Date(row.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...explanationPages];
}

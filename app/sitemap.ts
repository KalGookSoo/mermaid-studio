import type { MetadataRoute } from "next";
import { diagrams } from "./diagram-catalog";
import { siteUrl } from "./site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/editor`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/guides`, changeFrequency: "monthly", priority: 0.8 },
    ...diagrams.map((diagram) => ({ url: `${siteUrl}/guides/${diagram.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

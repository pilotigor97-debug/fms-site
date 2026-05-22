import type { MetadataRoute } from "next";
import { getAllVerticalIds } from "@/lib/marketing/verticals";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://getfms.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/planos", priority: 0.9, changeFrequency: "monthly" },
    { path: "/recursos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/comparacao", priority: 0.9, changeFrequency: "monthly" },
    { path: "/rental/guia", priority: 0.8, changeFrequency: "monthly" },
    { path: "/facilities/guia", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.7, changeFrequency: "yearly" },
    { path: "/criar-conta", priority: 0.7, changeFrequency: "yearly" },
    { path: "/download", priority: 0.6, changeFrequency: "monthly" },
    { path: "/seguranca", priority: 0.8, changeFrequency: "monthly" },
    { path: "/termos-uso", priority: 0.4, changeFrequency: "yearly" },
    { path: "/politica-privacidade", priority: 0.4, changeFrequency: "yearly" },
  ];

  const verticalRoutes = getAllVerticalIds().map((v) => ({
    path: `/${v}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...verticalRoutes].map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

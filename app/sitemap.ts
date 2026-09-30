import type { MetadataRoute } from "next";

const BASE_URL = "https://compute-the-platform-to-build-six-fawn.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/agentnexos", "/platform", "/industries", "/resources", "/solutions", "/security", "/privacy", "/terms"];
  const locales = ["ar", "en"];
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/agentnexos" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/agentnexos" ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  return entries;
}

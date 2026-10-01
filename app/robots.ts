import type { MetadataRoute } from "next";

const BASE_URL = "https://compute-the-platform-to-build-six-fawn.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/ar/login", "/en/login", "/ar/account", "/en/account", "/ar/agentnexos", "/en/agentnexos"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

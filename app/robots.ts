import type { MetadataRoute } from "next";

const BASE_URL = "https://compute-the-platform-to-build-six-fawn.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/approvals", "/api/telemetry"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

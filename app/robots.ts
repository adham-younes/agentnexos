import { siteOrigin } from "@/lib/site";
import type { MetadataRoute } from "next";

const BASE_URL = siteOrigin;

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

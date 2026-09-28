import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules:{userAgent:"*",allow:"/"}, sitemap:"https://compute-the-platform-to-build-six-fawn.vercel.app/sitemap.xml" }; }

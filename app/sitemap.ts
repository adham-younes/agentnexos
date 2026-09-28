import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://compute-the-platform-to-build-six-fawn.vercel.app"; return ["ar","en"].map(locale=>({url:`${base}/${locale}`,lastModified:new Date(),changeFrequency:"weekly",priority:1})); }

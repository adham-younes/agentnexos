/** Set NEXT_PUBLIC_SITE_URL to https://agynexa.si after domain/DNS verification.
 * Keep the working production origin until the intended domain is connected. */
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://compute-the-platform-to-build-six-fawn.vercel.app";
export const plannedOrigin = "https://agynexa.si";
export const brandName = "AGYNEXA";

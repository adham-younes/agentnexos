/** Public identity is stable across production, aliases and previews. */
export const publicIdentity = {
    brandName: 'AGYNEXA',
    canonicalOrigin: 'https://agynexa.si',
    contactEmail: 'adham@agynexa.si',
    supportedLocales: ['ar', 'en'],
} as const;
export const siteOrigin = publicIdentity.canonicalOrigin;
export const plannedOrigin = siteOrigin;
export const brandName = publicIdentity.brandName;
export const contactEmail = publicIdentity.contactEmail;
export const isPreview = process.env.VERCEL_ENV === 'preview';
export const contentUpdatedAt = '2026-10-16T00:00:00.000Z';

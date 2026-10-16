import { siteOrigin, isPreview } from '@/lib/site';
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
    return isPreview ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/ar/login', '/en/login', '/ar/auth/', '/en/auth/'] }, sitemap: `${siteOrigin}/sitemap.xml` };
}

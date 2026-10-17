import { siteOrigin, isPreview } from '@/lib/site';
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
    return isPreview ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/login', '/agentnexos', '/auth/', '/ar/login', '/en/login', '/ar/agentnexos', '/en/agentnexos', '/ar/auth/', '/en/auth/'] }, sitemap: `${siteOrigin}/sitemap.xml` };
}

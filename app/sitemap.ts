import { siteOrigin, isPreview, contentUpdatedAt } from '@/lib/site';
import type { MetadataRoute } from 'next';
import { revisionRoutes } from '@/lib/content/revision';
import { industrySlugs } from '@/lib/content/industries';
import { publicPath } from '@/lib/i18n/routing';
export default function sitemap(): MetadataRoute.Sitemap {
    if (isPreview)
        return [];
    const paths = new Set([...revisionRoutes.map(route => publicPath(`/${route}`)), ...industrySlugs.map(slug => `/industries/${slug}`)]);
    return [...paths].map(path => ({
        url: `${siteOrigin}${path}`,
        lastModified: contentUpdatedAt,
        changeFrequency: 'weekly' as const,
        priority: path === '/' ? 1 : 0.8,
        alternates: { languages: { en: `${siteOrigin}${path}`, 'x-default': `${siteOrigin}${path}` } },
    }));
}

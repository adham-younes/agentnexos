import { siteOrigin, isPreview, contentUpdatedAt } from '@/lib/site';
import type { MetadataRoute } from 'next';
import { revisionRoutes } from '@/lib/content/revision';
export default function sitemap():MetadataRoute.Sitemap {
 if(isPreview)return [];
 return revisionRoutes.flatMap(route=>['ar','en'].map(locale=>{const path=route?`/${route}`:'';return {url:`${siteOrigin}/${locale}${path}`,lastModified:contentUpdatedAt,changeFrequency:'weekly' as const,priority:route?0.8:1,alternates:{languages:{ar:`${siteOrigin}/ar${path}`,en:`${siteOrigin}/en${path}`}}};}));
}

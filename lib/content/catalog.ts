import solutions from './catalog/solutions.json';
import industries from './catalog/industries.json';
import articles from './catalog/articles.json';
export const catalogs={solutions,industries,resources:articles};
export type CatalogKind=keyof typeof catalogs;
export const catalogLabels={ar:{solutions:'الحلول',industries:'القطاعات',resources:'مركز المعرفة'},en:{solutions:'Solutions',industries:'Industries',resources:'Knowledge center'}};

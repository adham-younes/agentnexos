import { publicPath } from '@/lib/i18n/routing';

/** Authentication returns only to explicit public application destinations. */
export function accountDestination(value: string | null | undefined): string {
  if (!value || /[\\\u0000-\u0020\u007f]/.test(value) || value.startsWith('//')) return '/agentnexos';
  const path = publicPath(value);
  return ['/agentnexos', '/start'].includes(path) ? path : '/agentnexos';
}

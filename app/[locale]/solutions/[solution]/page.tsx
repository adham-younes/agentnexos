import { notFound } from 'next/navigation';
import { PublicPage } from '@/components/site/public-page';
import { revisionMetadata } from '@/lib/content/revision';
import { isLocale } from '@/lib/i18n/config';
const solutions = ['knowledge', 'procurement', 'receivables', 'customer-operations'] as const;
type Solution = typeof solutions[number];
function isSolution(value: string): value is Solution { return solutions.some(solution => solution === value); }
type Props = { params: Promise<{ locale: string; solution: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return solutions.map(solution => ({ solution })); }
export async function generateMetadata({ params }: Props) {
  const { locale, solution } = await params;
  if (!isLocale(locale) || !isSolution(solution)) notFound();
  return revisionMetadata(`solutions/${solution}`, locale);
}
export default async function Page({ params }: Props) {
  const { locale, solution } = await params;
  if (!isLocale(locale) || !isSolution(solution)) notFound();
  return <PublicPage page={`solutions/${solution}`} locale={locale}/>;
}

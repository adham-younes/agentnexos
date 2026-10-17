import Link from 'next/link';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { PageHeader } from './page-header';
import { publicPages, type PublicPageKey } from '@/lib/content/public-pages';
import type { Locale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { type RevisionPage } from '@/lib/content/revision';
import { masterPage } from '@/lib/content/master';
import { ContentBody } from './content-body';
import { contactEmail } from '@/lib/site';
import { EditorialPage } from './editorial-page';
import { SolutionsPage, isSolutionPage } from './solutions-page';
import { OfferingsPage } from './offerings-page';
import { IndustriesHub } from './industry-pages';
const controlLabels = ['الزر', 'Button', 'Closing', 'الخاتمة', 'الفقرة الختامية', 'الرابط', 'Link', 'Contact', 'تواصل', 'السعر', 'Pricing', 'السعر', 'الصفة', 'Role', 'عنوان المؤسس', 'Founder heading'];
export function PublicPage({ page, locale }: {
    page: PublicPageKey | RevisionPage | 'engagements';
    locale: Locale;
}) {
    if (page === 'industries')
        return <IndustriesHub locale={locale}/>;
    if (page === 'engagements' || page === 'resources')
        return <OfferingsPage page={page} locale={locale}/>;
    if (isSolutionPage(page))
        return <SolutionsPage page={page} locale={locale}/>;
    if (page === 'services' || page === 'methodology' || page === 'about')
        return <EditorialPage page={page} locale={locale}/>;
    const ar = locale === 'ar', legal = page === 'privacy' || page === 'terms';
    const approved = masterPage(locale, page), historical = publicPages[page as PublicPageKey]?.[locale];
    const title = legal ? historical.title : approved.title, intro = legal ? historical.intro : approved.intro;
    const cards = legal ? historical.cards.map(([heading, ...body]) => ({ heading: heading.replace(/^\d+\s*[·—]\s*/, ''), body: body.join('\n\n') })) : approved.sections.filter(x => !controlLabels.includes(x.heading));
    return <CyberEffects className={`upgrade-site upgrade-public nexus-page-${page}`}><PageHeader /><main id="main-content" tabIndex={-1}>
 <section className="upgrade-page-hero nexus-wrap"><p className="upgrade-eyebrow">AGYNEXA / {ar ? 'من الفكرة إلى نطاق واضح' : 'FROM IDEA TO A DEFINED SCOPE'}</p><h1>{title}</h1><p className="upgrade-lead">{intro}</p>{!legal && <Link className="upgrade-text-link" href={publicPath('/start')}>{ar ? 'ناقش مشروعك' : 'Discuss your project'}<ArrowUpRight size={18}/></Link>}</section>
 <section className="upgrade-section nexus-wrap"><div className={`upgrade-card-grid ${legal ? 'upgrade-legal' : ''}`}>
 {cards.map((c, i) => <article className="upgrade-card" key={c.heading}><div className="upgrade-card-top"><span className="upgrade-step">{String(i + 1).padStart(2, '0')}</span>{legal ? <ShieldCheck size={20}/> : <Check size={20}/>}</div><h2>{c.heading}</h2><ContentBody text={c.body}/></article>)}
 </div>{!legal && <div className="upgrade-public-notes">{approved.sections.filter(x => controlLabels.includes(x.heading) && !['الزر', 'Button', 'الصفة', 'Role', 'عنوان المؤسس', 'Founder heading', 'الرابط', 'Link'].includes(x.heading)).map(x => <p key={x.heading}>{x.body}</p>)}</div>}
 </section>{!legal && <section className="upgrade-contact nexus-wrap"><h2>{ar ? 'ناقش مشروعك' : 'Discuss your project'}</h2><div className="upgrade-actions"><Link href={publicPath('/start')} className="upgrade-button">{approved.sections.filter(x => ['Button', 'الزر'].includes(x.heading)).at(-1)?.body ?? (ar ? 'ناقش مشروعك' : 'Discuss your project')}<ArrowUpRight size={18}/></Link><a className="upgrade-text-link" href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a></div></section>}
 </main><CyberFooter locale={locale}/></CyberEffects>;
}

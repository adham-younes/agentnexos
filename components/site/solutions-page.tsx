import Link from 'next/link';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { masterPage } from '@/lib/content/master';
import { publicCopy } from '@/lib/content/public-copy';
import type { Locale } from '@/lib/i18n/config';
import { PageHeader } from './page-header';

const solutionPages = ['solutions', 'solutions/knowledge', 'solutions/procurement', 'solutions/receivables', 'solutions/customer-operations'] as const;
type SolutionPage = typeof solutionPages[number];
export function isSolutionPage(page: string): page is SolutionPage {
    return solutionPages.some(route => route === page);
}

export function SolutionsPage({ page, locale }: { page: SolutionPage; locale: Locale }) {
    const copy = masterPage(locale, page), shared = publicCopy[locale], index = page === 'solutions';
    return <CyberEffects className={`upgrade-site upgrade-editorial upgrade-solutions ${index ? 'solutions-index' : 'solution-detail'}`}>
        <PageHeader/>
        <main id="main-content" tabIndex={-1}>
            <section className="upgrade-page-hero nexus-wrap">
                {index ? <p className="upgrade-eyebrow"><bdi>AGYNEXA</bdi></p> : <Link className="upgrade-text-link solutions-back" href={`/${locale}/solutions`}><ArrowLeft size={18} aria-hidden="true"/>{shared.allSolutions}</Link>}
                <h1>{copy.title}</h1>
                <p className="upgrade-lead">{copy.intro}</p>
                {!index && <p className="solution-scope">{shared.solutionScope}</p>}
            </section>
            <div className="upgrade-section nexus-wrap">
                {index ? <div className="solutions-grid">
                    {copy.sections.map(solution => <article className="solution-choice" key={solution.heading}>
                        <h2>{solution.heading}</h2><p>{solution.body}</p>
                        {solution.link && <Link className="upgrade-text-link" href={`/${locale}/${solution.link.path}`}>{solution.link.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                    </article>)}
                </div> : <div className="solution-sections">
                    {copy.sections.map(section => <section className={`editorial-row${section.boundary ? ' solution-boundary' : ''}`} key={section.heading}>
                        <h2>{section.heading}</h2><div className="editorial-prose"><p>{section.body}</p></div>
                    </section>)}
                </div>}
                <div className="editorial-closing">
                    {copy.closing && <p>{copy.closing}</p>}
                    <div className="upgrade-actions">
                        {copy.primaryAction && <Link className="upgrade-button" href={`/${locale}/${copy.primaryAction.path}`}>{copy.primaryAction.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                    </div>
                </div>
            </div>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

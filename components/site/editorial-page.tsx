import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { masterPage } from '@/lib/content/master';
import { contactEmail } from '@/lib/site';
import { publicCopy } from '@/lib/content/public-copy';
import type { Locale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { PageHeader } from './page-header';

type EditorialRoute = 'services' | 'methodology' | 'about';

function Paragraphs({ text }: { text: string }) {
    return <>{text.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</>;
}

export function EditorialPage({ page, locale }: { page: EditorialRoute; locale: Locale }) {
    const copy = masterPage(locale, page);
    return <CyberEffects className={`upgrade-site upgrade-editorial upgrade-editorial-${page}`}>
        <PageHeader/>
        <main id="main-content" tabIndex={-1}>
            <section className="upgrade-page-hero nexus-wrap">
                <p className="upgrade-eyebrow"><bdi>AGYNEXA</bdi></p>
                <h1>{copy.title}</h1>
                <p className="upgrade-lead">{copy.intro}</p>
            </section>
            <div className="upgrade-section nexus-wrap">
                {page === 'about' ? <>
                    {copy.sections.map(section => <section className="editorial-row" key={section.heading}>
                        <h2>{section.heading}</h2><div className="editorial-prose"><Paragraphs text={section.body}/></div>
                    </section>)}
                    {copy.founder && <section className="upgrade-card editorial-leadership" aria-labelledby="leadership-name">
                        <h2 id="leadership-name">{copy.founder.name}</h2>
                        <p className="editorial-role">{copy.founder.role}</p>
                        <a className="upgrade-text-link" href={`mailto:${contactEmail}`} dir="ltr"><bdi>{contactEmail}</bdi></a>
                    </section>}
                </> : page === 'methodology' ? <ol className="editorial-stages">
                    {copy.sections.map((stage, index) => <li className="editorial-row" key={stage.heading}>
                        <h2><span className="editorial-number"><bdi>{String(index + 1).padStart(2, '0')} —</bdi></span>{' '}{stage.heading}</h2>
                        <div className="editorial-prose"><p>{stage.body}</p><p className="editorial-deliverable">{stage.deliverable}</p></div>
                    </li>)}
                </ol> : <div className="editorial-services">
                    {copy.sections.map(service => <section className="editorial-row" key={service.heading}>
                        <h2>{service.heading}</h2>
                        <div className="editorial-prose"><p>{service.body}</p><p className="editorial-deliverable">{service.deliverable}</p></div>
                    </section>)}
                </div>}
                <div className="editorial-closing">
                    {copy.closing && <p>{copy.closing}</p>}
                    <div className="upgrade-actions">
                        {copy.primaryAction && <Link className="upgrade-button" href={publicPath(`/${copy.primaryAction.path}`)}>{copy.primaryAction.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        {copy.secondaryAction && <Link className="upgrade-text-link" href={publicPath(`/${copy.secondaryAction.path}`)}>{copy.secondaryAction.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        {page === 'services' && <Link className="upgrade-text-link" href={publicPath('/engagements')}>{publicCopy[locale].engagementOptions}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                    </div>
                </div>
            </div>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

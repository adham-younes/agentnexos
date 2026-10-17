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
                </> : page === 'methodology' ? <ol className="editorial-timeline">
                    {copy.sections.map((stage, index) => <li className="editorial-timeline-stage" key={stage.heading}>
                        <span className="editorial-timeline-marker" aria-hidden="true"><bdi>{String(index + 1).padStart(2, '0')}</bdi></span>
                        <section className="editorial-timeline-copy" aria-labelledby={`method-stage-${index + 1}`}>
                            <h2 id={`method-stage-${index + 1}`}>{stage.heading}</h2><p>{stage.body}</p>{stage.deliverable && <p className="editorial-timeline-output">{stage.deliverable}</p>}
                        </section>
                    </li>)}
                </ol> : <div className="editorial-service-list">
                    {copy.sections.map((service, index) => <section className="editorial-service-offering" key={service.heading} aria-labelledby={`service-offering-${index + 1}`}>
                        <span className="editorial-service-number" aria-hidden="true"><bdi>{String(index + 1).padStart(2, '0')}</bdi></span>
                        <div className="editorial-service-content">
                            <h2 id={`service-offering-${index + 1}`}>{service.heading}</h2>
                            <div className="editorial-service-description">{service.deliverable && <p className="editorial-service-output">{service.deliverable}</p>}<p>{service.body}</p></div>
                        </div>
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

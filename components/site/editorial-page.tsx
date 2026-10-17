import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { masterPage } from '@/lib/content/master';
import { contactEmail } from '@/lib/site';
import { publicCopy } from '@/lib/content/public-copy';
import type { Locale } from '@/lib/i18n/config';
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
                    {copy.founder && <section className="editorial-row editorial-founder" aria-labelledby="founder-name">
                        <div><h2 id="founder-name">{copy.founder.name}</h2><p className="editorial-role">{copy.founder.role}</p></div>
                        <div className="editorial-prose"><Paragraphs text={copy.founder.bio}/></div>
                    </section>}
                    {copy.sections.map(section => <section className="editorial-row" key={section.heading}>
                        <h2>{section.heading}</h2><div className="editorial-prose"><Paragraphs text={section.body}/></div>
                    </section>)}
                    {copy.projects && <section className="editorial-projects" aria-labelledby="independent-projects">
                        <h2 id="independent-projects">{copy.projects.heading}</h2>
                        <dl>{copy.projects.items.map(project => <div className="editorial-row" key={project.heading}>
                            <dt><bdi lang="en">{project.heading}</bdi></dt><dd>{project.body}</dd>
                        </div>)}</dl>
                        <p className="editorial-project-note">{copy.projects.note}</p>
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
                        {copy.primaryAction && <Link className="upgrade-button" href={`/${locale}/${copy.primaryAction.path}`}>{copy.primaryAction.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        {copy.secondaryAction && <Link className="upgrade-text-link" href={`/${locale}/${copy.secondaryAction.path}`}>{copy.secondaryAction.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        {page === 'services' && <Link className="upgrade-text-link" href={`/${locale}/engagements`}>{publicCopy[locale].engagementOptions}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        {page === 'about' && <a className="upgrade-text-link" href={`mailto:${contactEmail}`} dir="ltr"><bdi>{contactEmail}</bdi></a>}
                    </div>
                </div>
            </div>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

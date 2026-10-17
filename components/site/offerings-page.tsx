import { publicPath } from '@/lib/i18n/routing';
import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { masterPage } from '@/lib/content/master';
import { publicCopy } from '@/lib/content/public-copy';
import type { Locale } from '@/lib/i18n/config';
import { PageHeader } from './page-header';

export function OfferingsPage({ page, locale }: { page: 'engagements' | 'resources'; locale: Locale }) {
    const copy = masterPage(locale, page), shared = publicCopy[locale];
    const downloads = copy.sections.slice(0, 2), assistant = copy.sections[2];
    return <CyberEffects className={`upgrade-site upgrade-editorial upgrade-offerings offerings-${page}`}>
        <PageHeader/>
        <main id="main-content" tabIndex={-1}>
            <section className="upgrade-page-hero nexus-wrap">
                <p className="upgrade-eyebrow"><bdi>AGYNEXA</bdi></p>
                <h1>{copy.title}</h1><p className="upgrade-lead">{copy.intro}</p>
            </section>
            <div className="upgrade-section nexus-wrap">
                {page === 'engagements' ? <>
                    <div className="engagement-grid">
                        {copy.sections.map(engagement => <article className="engagement-card" key={engagement.id} data-engagement={engagement.id}>
                            <h2>{engagement.heading}</h2><p>{engagement.body}</p>
                            <p className="engagement-label">{shared.includes}</p>
                            <ul>{engagement.includes?.map(item => <li key={item}>{item}</li>)}</ul>
                            <div className="engagement-outcome"><p className="engagement-label">{shared.outcome}</p><p>{engagement.outcome}</p></div>
                            <div className="engagement-action">{engagement.link && <Link className="upgrade-button" href={publicPath(`/${engagement.link.path}`)}>{engagement.link.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}</div>
                        </article>)}
                    </div>
                    <div className="engagement-questions">{copy.faq?.map(item => <section className="editorial-row" key={item.question}>
                        <h2>{item.question}</h2><div className="editorial-prose"><p>{item.answer}</p></div>
                    </section>)}</div>
                </> : <>
                    <div className="resource-downloads">{downloads.map(resource => <article className="resource-file" key={resource.heading}>
                        <p className="resource-type"><bdi lang="en">Markdown (.md)</bdi></p>
                        <h2>{resource.heading}</h2><p>{resource.body}</p>
                        {resource.link && <a className="upgrade-button secondary" href={resource.link.path} download={resource.link.path.split('/').at(-1)}><Download size={18} aria-hidden="true"/>{resource.link.label}</a>}
                    </article>)}</div>
                    <section className="editorial-row resource-assistant">
                        <h2>{assistant.heading}</h2><div className="editorial-prose"><p>{assistant.body}</p>
                            {assistant.link && <Link className="upgrade-text-link" href={publicPath(`/${assistant.link.path}`)}>{assistant.link.label}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
                        </div>
                    </section>
                </>}
            </div>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

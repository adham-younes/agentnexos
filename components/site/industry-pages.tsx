import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { getIndustries, getIndustry, industryUi, type IndustrySlug } from '@/lib/content/industries';
import type { Locale } from '@/lib/i18n/config';
import { publicPath } from '@/lib/i18n/routing';
import { PageHeader } from './page-header';
import './industry-pages.css';

function IndustryBreadcrumb({ locale, current }: { locale: Locale; current?: string }) {
    const ui = industryUi[locale];
    return <nav className="industry-breadcrumb" aria-label={ui.breadcrumb}>
        <ol>
            <li><Link href={publicPath('/')}>{ui.home}</Link></li>
            <li><ChevronRight size={14} aria-hidden="true"/>{current ? <Link href={publicPath('/industries')}>{ui.industries}</Link> : <span aria-current="page">{ui.industries}</span>}</li>
            {current && <li><ChevronRight size={14} aria-hidden="true"/><span aria-current="page">{current}</span></li>}
        </ol>
    </nav>;
}

function IndustryNextStep({ locale }: { locale: Locale }) {
    const ui = industryUi[locale];
    return <section className="industry-next nexus-wrap" aria-labelledby="industry-next-title">
        <div><p className="upgrade-eyebrow">{ui.nextEyebrow}</p><h2 id="industry-next-title">{ui.nextTitle}</h2><p>{ui.nextBody}</p></div>
        <div className="upgrade-actions">
            <Link className="upgrade-button" href={publicPath('/start')}>{ui.brief}<ArrowUpRight size={18} aria-hidden="true"/></Link>
            <Link className="upgrade-text-link" href={publicPath('/agentnexos')}>{ui.assistant}<ArrowUpRight size={18} aria-hidden="true"/></Link>
        </div>
    </section>;
}

export function IndustriesHub({ locale }: { locale: Locale }) {
    const ui = industryUi[locale], industries = getIndustries(locale);
    return <CyberEffects className="upgrade-site industry-site industry-hub">
        <PageHeader/>
        <main id="main-content" tabIndex={-1}>
            <section className="industry-page-hero industry-hub-hero">
                <div className="industry-hero-geometry" aria-hidden="true"><span/><span/><span/></div>
                <div className="nexus-wrap industry-hero-copy">
                    <IndustryBreadcrumb locale={locale}/>
                    <p className="upgrade-eyebrow">{ui.eyebrow}</p><h1>{ui.hubTitle}</h1><p className="industry-hero-intro">{ui.hubIntro}</p>
                </div>
            </section>
            <section className="industry-section nexus-wrap" aria-labelledby="industry-grid-title">
                <div className="industry-section-heading"><h2 id="industry-grid-title">{ui.gridTitle}</h2><p>{ui.gridIntro}</p></div>
                <div className="industry-grid">
                    {industries.map((industry, index) => <article className="industry-card" key={industry.slug}>
                        <div className="industry-card-top" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><span>AGYNEXA</span></div>
                        <div className="industry-card-body"><p className="industry-focus">{industry.focus}</p><h3><Link href={publicPath(`/industries/${industry.slug}`)}>{industry.name}</Link></h3><p>{industry.summary}</p><dl className="industry-card-outcome"><dt>{ui.outcome}</dt><dd>{industry.deliverable}</dd></dl><Link className="upgrade-text-link" href={publicPath(`/industries/${industry.slug}`)} aria-label={`${ui.explore}: ${industry.name}`}>{ui.explore}<ArrowUpRight size={18} aria-hidden="true"/></Link></div>
                    </article>)}
                </div>
            </section>
            <section className="industry-approach nexus-wrap" aria-labelledby="industry-approach-title">
                <h2 id="industry-approach-title">{ui.approachTitle}</h2>
                <ol>{ui.approach.map((step, index) => <li key={step.title}><span className="industry-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
            </section>
            <section className="industry-scope nexus-wrap" aria-labelledby="industry-scope-title"><h2 id="industry-scope-title">{ui.scopeTitle}</h2><p>{ui.scope}</p></section>
            <IndustryNextStep locale={locale}/>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

export function IndustryDetail({ locale, industry: slug }: { locale: Locale; industry: IndustrySlug }) {
    const ui = industryUi[locale], industry = getIndustry(locale, slug);
    return <CyberEffects className={`upgrade-site industry-site industry-detail industry-${slug}`}>
        <PageHeader/>
        <main id="main-content" tabIndex={-1}>
            <section className="industry-page-hero">
                <div className="industry-hero-geometry" aria-hidden="true"><span/><span/><span/></div>
                <div className="nexus-wrap industry-hero-copy"><IndustryBreadcrumb locale={locale} current={industry.name}/><p className="upgrade-eyebrow">{industry.name}</p><h1>{industry.title}</h1><p className="industry-hero-intro">{industry.intro}</p></div>
            </section>
            <section className="industry-section nexus-wrap" aria-labelledby="industry-situations-title">
                <div className="industry-section-heading"><div><p className="upgrade-eyebrow">{ui.situationsEyebrow}</p><h2 id="industry-situations-title">{ui.situationsTitle}</h2></div><p>{ui.situationsIntro}</p></div>
                <div className="industry-scenarios">{industry.scenarios.map((scenario, index) => <article className="industry-scenario" key={scenario.title}>
                    <div className="industry-scenario-heading"><span className="industry-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{scenario.title}</h3><p>{scenario.situation}</p></div>
                    <dl><div><dt>{ui.output}</dt><dd>{scenario.output}</dd></div><div><dt>{ui.decision}</dt><dd>{scenario.decision}</dd></div></dl>
                </article>)}</div>
            </section>
            <section className="industry-definition nexus-wrap" aria-labelledby="industry-definition-title">
                <div className="industry-section-heading"><div><p className="upgrade-eyebrow">{ui.inputsEyebrow}</p><h2 id="industry-definition-title">{ui.inputsTitle}</h2></div><p>{ui.inputsIntro}</p></div>
                <div className="industry-definition-grid">
                    <div className="industry-inputs"><h3>{ui.inputs}</h3><ul>{industry.inputs.map(input => <li key={input}>{input}</li>)}</ul></div>
                    <div className="industry-deliverable"><p className="industry-label">{ui.outcome}</p><p className="industry-deliverable-title">{industry.deliverable}</p><h3>{ui.acceptance}</h3><ul>{industry.acceptance.map(check => <li key={check}>{check}</li>)}</ul></div>
                </div>
                <div className="industry-responsibility"><h3>{ui.responsibility}</h3><p>{industry.responsibility}</p></div>
            </section>
            <section className="industry-boundary nexus-wrap" aria-labelledby="industry-boundary-title"><h2 id="industry-boundary-title">{ui.boundary}</h2><div><p>{industry.boundary}</p><p>{ui.scope}</p></div></section>
            <section className="industry-related nexus-wrap" aria-labelledby="industry-related-title"><div><p className="upgrade-eyebrow">{ui.related}</p><h2 id="industry-related-title">{industry.related.title}</h2><p>{industry.related.body}</p></div><Link className="upgrade-button secondary" href={publicPath(industry.related.path)}>{ui.relatedAction}<ArrowUpRight size={18} aria-hidden="true"/></Link></section>
            <IndustryNextStep locale={locale}/>
            <nav className="industry-other nexus-wrap" aria-label={ui.otherIndustries}><h2>{ui.otherIndustries}</h2><div>{getIndustries(locale).filter(other => other.slug !== slug).map(other => <Link href={publicPath(`/industries/${other.slug}`)} key={other.slug}>{other.name}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div></nav>
        </main>
        <CyberFooter locale={locale}/>
    </CyberEffects>;
}

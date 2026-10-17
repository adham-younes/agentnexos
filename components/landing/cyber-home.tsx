'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/use-t';
import { publicPath } from '@/lib/i18n/routing';
import { masterHome, masterValue } from '@/lib/content/master';
import { Navigation } from './navigation';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { contactEmail } from '@/lib/site';

export function CyberHome() {
    const locale = useLocale();
    const ar = locale === 'ar';
    const c = masterHome(locale);
    const [hero, workflow, capabilities, solutions, start] = c.groups;
    const value = (group: typeof hero, ...labels: string[]) => masterValue(group.fields, ...labels);
    const cardFields = (group: typeof hero, labels: string[]) => group.fields.filter(field => !labels.includes(field.heading));
    const steps = value(workflow, 'عناوين الخطوات', 'Steps').split('|').map(step => step.trim()).filter(Boolean);
    const solutionPaths = ['/solutions/knowledge', '/solutions/procurement', '/solutions/receivables', '/solutions/customer-operations'];
    const exampleFields = [
        { label: ar ? 'الطلب' : 'Request', body: value(workflow, 'Example input') },
        { label: ar ? 'المعلومة الناقصة' : 'Missing information', body: value(workflow, 'Example missing') },
        { label: ar ? 'النتيجة المقترحة' : 'Proposed output', body: value(workflow, 'Example output') },
    ].filter(field => field.body);

    return <CyberEffects className="upgrade-site upgrade-home premium-home">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
            <section className="premium-hero" aria-labelledby="home-title">
                <div className="premium-hero-art" aria-hidden="true">
                    <Image className="premium-hero-image" src="/images/premium/enterprise-port-hero.webp" alt="" fill sizes="100vw" preload />
                </div>
                <div className="premium-hero-shade" aria-hidden="true" />
                <div className="nexus-wrap">
                    <div className="premium-hero-copy">
                        <p className="upgrade-eyebrow">{ar ? 'هندسة أنظمة الوكلاء' : 'AI AGENT SYSTEMS ENGINEERING'}</p>
                        <h1 id="home-title">{value(hero, 'العنوان', 'Title')}</h1>
                        <p className="premium-hero-intro">{value(hero, 'الفقرة', 'Body')}</p>
                    </div>
                </div>
                <div className="premium-hero-foot nexus-wrap">
                    <ul className="premium-principles" aria-label={ar ? 'مبادئ التصميم' : 'Design principles'}>
                        <li>{ar ? 'مصادر موثوقة' : 'Trusted sources'}</li>
                        <li>{ar ? 'مسؤوليات واضحة' : 'Clear responsibilities'}</li>
                        <li>{ar ? 'نتائج قابلة للمراجعة' : 'Reviewable results'}</li>
                    </ul>
                    <a href="#workflow-example" className="premium-explore" aria-label={ar ? 'استكشف مثال سير العمل' : 'Explore the workflow example'}>
                        <span className="premium-explore-number" aria-hidden="true">01</span>
                        <span>{ar ? 'من الفكرة إلى مسار واضح' : 'From an idea to a clear workflow'}</span>
                        <ArrowDown size={18} aria-hidden="true" />
                    </a>
                </div>
            </section>

            <section id="workflow-example" className="upgrade-section premium-workflow nexus-wrap" aria-labelledby="workflow-heading">
                <div className="premium-section-heading">
                    <div><p className="upgrade-eyebrow">01 / {ar ? 'من العمل إلى نتيجة واضحة' : 'FROM THE WORK TO A CLEAR RESULT'}</p><h2 id="workflow-heading">{value(workflow, 'العنوان', 'Title')}</h2></div>
                    <p>{value(workflow, 'الفقرة', 'Body')}</p>
                </div>
                <div className="premium-workflow-story">
                    <ol className="premium-workflow-steps">
                        {steps.map((step, index) => <li key={step}><span className="upgrade-step">{String(index + 1).padStart(2, '0')}</span><h3>{step}</h3></li>)}
                    </ol>
                    {exampleFields.length > 0 && <div className="premium-output">
                        <p className="premium-output-title">{value(workflow, 'Example label') || (ar ? 'مقتطف من الموجز' : 'Inside the review brief')}</p>
                        <dl>{exampleFields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.body}</dd></div>)}</dl>
                    </div>}
                </div>
                <p className="upgrade-caption">{value(workflow, 'وسم المثال', 'Label')}</p>
                <p className="premium-workflow-scope">{value(hero, 'النص المساند', 'Supporting text')}</p>
            </section>

            <section className="upgrade-section nexus-wrap" aria-labelledby="capabilities-heading">
                <div className="upgrade-section-head"><p className="upgrade-eyebrow">02 / {ar ? 'القدرات' : 'CAPABILITIES'}</p><h2 id="capabilities-heading">{value(capabilities, 'العنوان', 'Title')}</h2></div>
                <div className="premium-capabilities">
                    {cardFields(capabilities, ['العنوان', 'Title', 'رابط القسم', 'Link']).map((field, index) => <article className="premium-capability" key={field.heading}>
                        <span className="upgrade-step">{String(index + 1).padStart(2, '0')}</span><h3>{field.heading}</h3><p>{field.body}</p>
                    </article>)}
                </div>
                <Link className="upgrade-text-link" href={publicPath('/platform')}>{value(capabilities, 'رابط القسم', 'Link')}<ArrowUpRight size={18} aria-hidden="true" /></Link>
            </section>

            <section className="upgrade-section nexus-wrap" aria-labelledby="solutions-heading">
                <div className="upgrade-section-head"><p className="upgrade-eyebrow">03 / {ar ? 'الحلول' : 'SOLUTIONS'}</p><h2 id="solutions-heading">{value(solutions, 'العنوان', 'Title')}</h2></div>
                <div className="premium-home-solutions">
                    {cardFields(solutions, ['العنوان', 'Title', 'رابط القسم', 'Link', 'ملاحظة', 'Note']).map((field, index) => <Link href={publicPath(solutionPaths[index] ?? '/solutions')} className="upgrade-card upgrade-card-link" key={field.heading}>
                        <ArrowUpRight size={22} aria-hidden="true" /><h3>{field.heading}</h3><p>{field.body}</p>
                    </Link>)}
                </div>
                <div className="upgrade-row"><Link className="upgrade-text-link" href={publicPath('/solutions')}>{value(solutions, 'رابط القسم', 'Link')}<ArrowUpRight size={18} aria-hidden="true" /></Link><p className="upgrade-caption">{value(solutions, 'ملاحظة', 'Note')}</p></div>
            </section>

            <section className="upgrade-section nexus-wrap">
                <div className="upgrade-split-card"><div><p className="upgrade-eyebrow">04 / {ar ? 'طريقة البداية' : 'GETTING STARTED'}</p><h2>{value(start, 'العنوان', 'Title')}</h2></div><div><p>{value(start, 'الفقرة', 'Body')}</p><Link className="upgrade-text-link" href={publicPath('/methodology')}>{value(start, 'الرابط', 'Link')}<ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
            </section>

            <section className="upgrade-section nexus-wrap upgrade-faq">
                <div><p className="upgrade-eyebrow">{ar ? 'قبل أن تبدأ' : 'BEFORE YOU START'}</p><h2>{ar ? 'أسئلة قبل البداية' : 'Questions before you start'}</h2></div>
                <div>{c.faq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
            </section>

            <section className="upgrade-contact nexus-wrap">
                <p className="upgrade-eyebrow">{ar ? 'خطوتك التالية' : 'YOUR NEXT STEP'}</p><h2>{value(start, 'العنوان الختامي', 'Closing title')}</h2><p>{start.fields.filter(field => ['الفقرة', 'Body'].includes(field.heading)).at(-1)?.body}</p>
                <div className="upgrade-actions"><Link className="upgrade-button" href={publicPath('/start')}>{value(start, 'الزر', 'Button')}<ArrowUpRight size={18} aria-hidden="true" /></Link><a className="upgrade-text-link" href={`mailto:${contactEmail}`} dir="ltr"><bdi>{contactEmail}</bdi></a></div>
            </section>
        </main>
        <CyberFooter locale={locale} />
    </CyberEffects>;
}

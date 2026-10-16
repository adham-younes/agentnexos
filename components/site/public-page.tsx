import Link from 'next/link';
import { ArrowUpRight, Check, FileText, ShieldCheck } from 'lucide-react';
import { PageHeader } from './page-header';
import { publicPages, type PublicPageKey } from '@/lib/content/public-pages';
import type { Locale } from '@/lib/i18n/config';
import { CyberEffects } from '@/components/cyber/effects';
import { CyberFooter } from '@/components/cyber/footer';
import { type RevisionPage } from '@/lib/content/revision';
import { masterPage } from '@/lib/content/master';
import { ContentBody } from './content-body';
import { contactEmail } from '@/lib/site';
const controlLabels=['الزر','Button','Closing','الخاتمة','الفقرة الختامية','الرابط','Link','Contact','تواصل','السعر','Pricing','السعر','الصفة','Role','عنوان المؤسس','Founder heading'];
export function PublicPage({page,locale}:{page:PublicPageKey|RevisionPage|'engagements';locale:Locale}) {
 const ar=locale==='ar',legal=page==='privacy'||page==='terms';
 const approved=masterPage(locale,page),historical=publicPages[page as PublicPageKey]?.[locale];
 const title=legal?historical.title:approved.title,intro=legal?historical.intro:approved.intro;
 const cards=legal?historical.cards.map(([heading,...body])=>({heading:heading.replace(/^\d+\s*[·—]\s*/,''),body:body.join('\n\n')})):approved.sections.filter(x=>!controlLabels.includes(x.heading));
 const packages=['discovery','pilot','delivery','support'];
 const solutionPaths=['knowledge','procurement','receivables','customer-operations'];
 return <CyberEffects className={`upgrade-site upgrade-public nexus-page-${page}`}><PageHeader/><main id="main-content" tabIndex={-1}>
 <section className="upgrade-page-hero nexus-wrap"><p className="upgrade-eyebrow">AGYNEXA / {ar?'من الفكرة إلى نطاق واضح':'FROM IDEA TO A DEFINED SCOPE'}</p><h1>{title}</h1><p className="upgrade-lead">{intro}</p>{!legal&&<Link className="upgrade-text-link" href={`/${locale}/start`}>{ar?'ناقش مشروعك':'Discuss your project'}<ArrowUpRight size={18}/></Link>}</section>
 <section className="upgrade-section nexus-wrap">{page==='about'&&<div className="upgrade-founder"><p className="upgrade-eyebrow">{ar?'المؤسس':'FOUNDER'}</p><h2>{approved.sections.find(x=>['عنوان المؤسس','Founder heading'].includes(x.heading))?.body}</h2><p>{approved.sections.find(x=>['الصفة','Role'].includes(x.heading))?.body}</p></div>}<div className={`upgrade-card-grid ${legal?'upgrade-legal':''} ${page==='methodology'?'upgrade-process-grid':''}`}>
 {cards.map((c,i)=><article className="upgrade-card" key={c.heading}><div className="upgrade-card-top"><span className="upgrade-step">{String(i+1).padStart(2,'0')}</span>{legal?<ShieldCheck size={20}/>:<Check size={20}/>}</div><h2>{c.heading}</h2><ContentBody text={c.body}/>{page==='solutions'&&i<4&&<Link className="upgrade-text-link" href={`/${locale}/solutions/${solutionPaths[i]}`}>{ar?'استكشف الحل':'Explore the solution'}<ArrowUpRight size={17}/></Link>}{page==='engagements'&&i<4&&<Link className="upgrade-text-link" href={`/${locale}/start?engagement=${packages[i]}`}>{['Button','الزر'].includes(approved.sections[i*2+1]?.heading)?approved.sections[i*2+1].body:ar?'ناقش نطاق العمل':'Discuss this engagement'}<ArrowUpRight size={17}/></Link>}{page==='resources'&&i<2&&<a className="upgrade-text-link" href={`/downloads/agentnexos/${i===0?'workflow-brief':'acceptance-plan'}-${locale}.md`} download><FileText size={17}/>{approved.sections.filter(x=>['Button','الزر'].includes(x.heading))[i]?.body ?? (ar?'تنزيل القالب':'Download template')}</a>}</article>)}
 </div>{!legal&&<div className="upgrade-public-notes">{approved.sections.filter(x=>controlLabels.includes(x.heading)&&!['الزر','Button','الصفة','Role','عنوان المؤسس','Founder heading','الرابط','Link'].includes(x.heading)).map(x=><p key={x.heading}>{x.body}</p>)}</div>}
 </section>{!legal&&<section className="upgrade-contact nexus-wrap"><h2>{ar?'ناقش مشروعك':'Discuss your project'}</h2><div className="upgrade-actions"><Link href={`/${locale}/start`} className="upgrade-button">{approved.sections.filter(x=>['Button','الزر'].includes(x.heading)).at(-1)?.body ?? (ar?'ناقش مشروعك':'Discuss your project')}<ArrowUpRight size={18}/></Link><a className="upgrade-text-link" href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a></div></section>}
 </main><CyberFooter locale={locale}/></CyberEffects>;
}

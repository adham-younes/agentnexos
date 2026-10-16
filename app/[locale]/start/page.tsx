import {revisionMetadata} from '@/lib/content/revision';
import {masterPage} from '@/lib/content/master';
import {notFound} from 'next/navigation';
import {CyberEffects} from '@/components/cyber/effects';
import {CyberFooter} from '@/components/cyber/footer';
import {PageHeader} from '@/components/site/page-header';
import {ProjectBriefForm} from '@/components/site/project-brief';
import {isLocale} from '@/lib/i18n/config';
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();return revisionMetadata('start',locale);}
export default async function Page({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const c=masterPage(locale,'start');return <CyberEffects className="upgrade-site upgrade-start"><PageHeader/><main id="main-content" tabIndex={-1}><section className="upgrade-page-hero nexus-wrap"><p className="upgrade-eyebrow">AGYNEXA / {locale==='ar'?'ناقش مشروعك':'DISCUSS YOUR PROJECT'}</p><h1>{c.title}</h1><p className="upgrade-lead">{c.intro}</p></section><section className="upgrade-section nexus-wrap"><ProjectBriefForm locale={locale}/></section></main><CyberFooter locale={locale}/></CyberEffects>}

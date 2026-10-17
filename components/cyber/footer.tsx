import { publicCopy } from "@/lib/content/public-copy";
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { contactEmail } from '@/lib/site';
export function CyberFooter({ locale }: {
    locale: Locale;
}) {
    const ar = locale === 'ar', copy = publicCopy[locale];
    return <footer id="site-footer" className="upgrade-footer"><div className="nexus-wrap"><div className="upgrade-footer-main"><Link href={`/${locale}`} className="nexus-brand" dir="ltr">AGYNEXA<span className="nexus-brand-dot"/></Link><p>{copy.footerDescription}</p><a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a><nav aria-label={ar ? 'روابط الموقع' : 'Site links'}>{[['platform', 'المنصة', 'Platform'], ['solutions', 'الحلول', 'Solutions'], ['services', 'الخدمات', 'Services'], ['methodology', 'المنهجية', 'Methodology'], ['resources', 'الموارد', 'Resources'], ['about', publicCopy.ar.about, publicCopy.en.about], ['engagements', publicCopy.ar.engagementOptions, publicCopy.en.engagementOptions], ['agentnexos', publicCopy.ar.workflowAssistant, publicCopy.en.workflowAssistant]].map(([path, a, e]) => <Link href={`/${locale}/${path}`} key={path}>{ar ? a : e}</Link>)}</nav></div><div className="upgrade-footer-bottom"><span dir="ltr">© {new Date().getFullYear()} AGYNEXA · Adham Younes</span><nav aria-label={ar ? 'الخصوصية والتواصل' : 'Privacy and contact'}>{[['privacy', 'الخصوصية', 'Privacy'], ['terms', 'الشروط', 'Terms'], ['security', 'الأمان', 'Security']].map(([p, a, e]) => <Link href={`/${locale}/${p}`} key={p}>{ar ? a : e}</Link>)}<a href={`mailto:${contactEmail}`}>{ar ? 'تواصل معنا' : 'Contact'}</a></nav></div></div></footer>;
}

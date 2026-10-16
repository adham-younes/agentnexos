import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { contactEmail } from '@/lib/site';
export function CyberFooter({ locale }: {
    locale: Locale;
}) {
    const ar = locale === 'ar';
    return <footer id="site-footer" className="upgrade-footer"><div className="nexus-wrap"><div className="upgrade-footer-main"><Link href={`/${locale}`} className="nexus-brand" dir="ltr">AGYNEXA<span className="nexus-brand-dot"/></Link><p>{ar ? 'AGYNEXA لهندسة أنظمة الوكلاء وأتمتة العمليات. نحدد سير العمل والبيانات والصلاحيات قبل الانتقال إلى التنفيذ.' : 'AGYNEXA designs AI agent systems and workflow automation. We define the workflow, data, and permissions before moving into implementation.'}</p><a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a><nav aria-label={ar ? 'روابط الموقع' : 'Site links'}>{[['platform', 'المنصة', 'Platform'], ['solutions', 'الحلول', 'Solutions'], ['services', 'الخدمات', 'Services'], ['methodology', 'المنهجية', 'Methodology'], ['resources', 'الموارد', 'Resources'], ['about', 'من نحن', 'About'], ['engagements', 'باقات العمل', 'Engagement options'], ['agentnexos', 'مساعد تصميم العمليات', 'Workflow design assistant']].map(([path, a, e]) => <Link href={`/${locale}/${path}`} key={path}>{ar ? a : e}</Link>)}</nav></div><div className="upgrade-footer-bottom"><span dir="ltr">© {new Date().getFullYear()} AGYNEXA · Adham Younes</span><nav aria-label={ar ? 'الخصوصية والتواصل' : 'Privacy and contact'}>{[['privacy', 'الخصوصية', 'Privacy'], ['terms', 'الشروط', 'Terms'], ['security', 'الأمان', 'Security']].map(([p, a, e]) => <Link href={`/${locale}/${p}`} key={p}>{ar ? a : e}</Link>)}<a href={`mailto:${contactEmail}`}>{ar ? 'تواصل معنا' : 'Contact'}</a></nav></div></div></footer>;
}

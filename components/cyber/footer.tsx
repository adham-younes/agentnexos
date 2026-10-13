import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
export function CyberFooter({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return <footer id="site-footer" className="nexus-footer"><div className="nexus-wrap"><div className="nexus-footer-main"><div><Link href={`/${locale}`} className="nexus-brand" dir="ltr">Agentnexos<span className="nexus-brand-dot" /></Link><p>{ar ? "أنظمة ذكية تنطلق من عملك، وتبقى تحت إدارتك." : "Intelligent systems, built around your work. Directed by you."}</p></div><nav aria-label={ar ? "روابط الموقع" : "Site links"}>{[["platform","المنصة","Platform"],["solutions","حالات الاستخدام","Use cases"],["industries","القطاعات","Industries"],["resources","مكتبة العمل","Field notes"],["about","عن Agentnexos","Our approach"],["security","الأمان","Security"],["privacy","الخصوصية","Privacy"],["terms","الشروط","Terms"]].map(([path,a,e])=><Link key={path} href={`/${locale}/${path}`}>{ar?a:e}<ArrowUpRight size={12} aria-hidden="true" /></Link>)}</nav></div><div className="nexus-footer-bottom"><span dir="ltr">© 2026 Agentnexos</span><span>{ar ? "من مصر. للفرق التي تبني ما هو قادم." : "From Egypt. For teams building what comes next."}</span><a href="#main-content">{ar ? "إلى الأعلى ↑" : "Back to top ↑"}</a></div></div></footer>;
}

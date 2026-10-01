"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-t";
import { Brand } from "@/components/site/brand";

export function FooterSection() {
  const locale=useLocale(),ar=locale==="ar";
  const groups=[{title:ar?"اكتشف":"Explore",links:[["solutions",ar?"الحلول":"Solutions"],["industries",ar?"القطاعات":"Industries"],["platform",ar?"التقنية والمنصة":"Technology & platform"],["roi",ar?"الجدوى وقياس الأثر":"Feasibility and impact"], ["integrations",ar?"التكاملات":"Integrations"], ["services",ar?"الخدمات":"Services"]]},{title:ar?"ابدأ":"Get started",links:[["agentnexos",ar?"مساحة الوكيل":"Agent workspace"],["start",ar?"موجز المشروع":"Project brief"],["resources",ar?"المعرفة":"Knowledge"],["about",ar?"عن AgentNexos":"About AgentNexos"]]},{title:ar?"الثقة":"Trust",links:[["security",ar?"الثقة والحوكمة":"Trust & governance"],["privacy",ar?"الخصوصية":"Privacy"],["terms",ar?"الشروط":"Terms"],["demo-policy",ar?"سياسة التجربة":"Preview policy"]]}];
  return <footer className="border-t border-border bg-card/40"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><Link href={`/${locale}`}><Brand /></Link><p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">{ar?"هندسة الأنظمة الوكيلة وأتمتة العمليات المؤسسية.":"Agent systems engineering and enterprise workflow automation."}</p></div>{groups.map(group=><div key={group.title}><h2 className="text-sm font-semibold">{group.title}</h2><ul className="mt-5 flex flex-col gap-3">{group.links.map(([path,label])=><li key={path}><Link href={`/${locale}/${path}`} className="inline-flex min-h-8 items-center text-sm text-muted-foreground hover:text-primary">{label}</Link></li>)}</ul></div>)}</div><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-border px-5 py-6 text-xs leading-6 text-muted-foreground sm:px-8"><p>© 2026 AgentNexos</p><p>{ar?"نربط المعرفة بالقرار، والقرار بالتنفيذ.":"Connecting knowledge to decisions, and decisions to execution."}</p></div></footer>;
}

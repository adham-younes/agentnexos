import content from './master-upgrade.json';
import type { Locale } from '@/lib/i18n/config';
export type MasterSection = {
    heading: string;
    body: string;
    deliverable?: string;
};
export type MasterPage = {
    title: string;
    intro: string;
    sections: MasterSection[];
    seoTitle?: string;
    seoDescription?: string;
    primaryAction?: { label: string; path: string };
    secondaryAction?: { label: string; path: string };
    closing?: string;
    founder?: { name: string; role: string; bio: string };
    projects?: { heading: string; items: MasterSection[]; note: string };
};
export type MasterHome = {
    groups: {
        name: string;
        fields: MasterSection[];
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
    seoTitle?: string;
    seoDescription?: string;
};
export function masterPage(locale: Locale, page: string): MasterPage { return (content[locale] as unknown as Record<string, MasterPage>)[page]; }
export function masterHome(locale: Locale): MasterHome { return content[locale].home; }
export function masterValue(sections: MasterSection[], ...labels: string[]): string { return sections.find(x => labels.includes(x.heading))?.body ?? ''; }
export const masterRoutes = Object.keys(content.en).filter(x => !['home', 'login', 'agentnexos'].includes(x));

'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, Download, Mail } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { masterPage, masterValue } from '@/lib/content/master';
import { projectEmailDraft } from '@/lib/project-brief';
import { contactEmail } from '@/lib/site';
import { engagementIds, parseEngagement, type Engagement } from '@/lib/engagements';
import { publicCopy } from '@/lib/content/public-copy';
const empty = { name: '', email: '', company: '', process: '', systems: '', volume: '', minutes: '', engagement: '' as Engagement | '' };
export function ProjectBriefForm({ locale, initialEngagement = '' }: {
    locale: Locale;
    initialEngagement?: Engagement | '';
}) {
    const ar = locale === 'ar', copy = masterPage(locale, 'start'), shared = publicCopy[locale];
    const packages = masterPage(locale, 'engagements').sections;
    const engagementLabel = (id: Engagement) => packages.find(item => item.id === id)!.heading;
    const [values, setValues] = useState(() => ({ ...empty, engagement: initialEngagement })), [text, setText] = useState(''), [notice, setNotice] = useState('');
    function syncEngagement(engagement: Engagement | '') {
        const url = new URL(window.location.href);
        if (engagement) url.searchParams.set('engagement', engagement);
        else url.searchParams.delete('engagement');
        window.history.replaceState(window.history.state, '', url);
    }
    const fields = masterValue(copy.sections, 'الحقول', 'Fields').split('\n');
    const update = (key: keyof typeof empty, value: string) => {
        if (key === 'engagement') {
            const engagement = parseEngagement(value);
            setValues(v => ({ ...v, engagement }));
            syncEngagement(engagement);
        } else setValues(v => ({ ...v, [key]: value }));
        setText(''); setNotice('');
    };
    const normalize = (s: string) => s.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/٫/g, '.').trim();
    const quote = (s: string) => s.split('\n').map(line => '> ' + line).join('\n');
    function review(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNotice('');
        const volume = normalize(values.volume), minutes = normalize(values.minutes);
        if (!values.name.trim() || values.process.trim().length < 3) {
            setNotice(ar ? 'استكمل الاسم ووصف العملية بوضوح.' : 'Complete your name and describe the process clearly.');
            return;
        }
        if ([volume, minutes].some(v => v !== '' && (!/^\d+(\.\d+)?$/.test(v) || Number(v) <= 0 || Number(v) > 1000000))) {
            setNotice(ar ? 'استخدم رقمًا موجبًا حتى مليون، أو اترك الحقل فارغًا.' : 'Use a positive number up to one million, or leave the field blank.');
            return;
        }
        const labels = fields;
        const lines = [ar ? '# موجز سير العمل' : '# Workflow brief', masterValue(copy.sections, 'للمسار المحلي الحالي', 'For the current local flow'), ...(['name', 'email', 'company', 'process', 'systems'] as const).flatMap((key, i) => [`## ${labels[i]}`, quote(values[key].trim() || (ar ? 'غير محدد' : 'Not specified'))])];
        if (values.engagement)
            lines.push(`## ${shared.engagementType}`, engagementLabel(values.engagement));
        if (volume && minutes)
            lines.push(ar ? '## عبء العمل الحالي' : '## Current workload', `${Number(volume).toLocaleString(locale)} × ${Number(minutes).toLocaleString(locale)} = ${(Number(volume) * Number(minutes)).toLocaleString(locale)} ${ar ? 'دقيقة شهريًا. هذا خط أساس وليس تقدير توفير.' : 'minutes per month. This is a baseline, not estimated savings.'}`);
        setText(lines.join('\n\n'));
    }
    function download() { const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `agynexa-brief-${locale}.md`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(ar ? 'جهّز المتصفح ملف التنزيل.' : 'Your browser prepared the download.'); }
    const draft = projectEmailDraft(text, locale), buttons = masterValue(copy.sections, 'الأزرار', 'Buttons').split('\n');
    return <form className="upgrade-brief" onSubmit={review}><div className="upgrade-brief-panel"><div className="upgrade-row"><p className="upgrade-eyebrow">{ar ? 'موجز المشروع' : 'PROJECT BRIEF'}</p><button type="button" className="upgrade-text-link" onClick={() => { if (Object.entries(values).some(([key, value]) => key !== 'engagement' && Boolean(value))) {
        setNotice(ar ? 'امسح الموجز أولًا لتحميل المثال دون استبدال بياناتك.' : 'Clear the brief first to load the example without replacing your entries.');
        return;
    } setValues({ ...empty, engagement: values.engagement, name: ar ? 'فريق العمليات' : 'Operations team', email: 'team@example.invalid', company: ar ? 'شركة مثال' : 'Example company', process: ar ? 'تصل طلبات شراء عبر نموذج داخلي، ويراجع الفريق اكتمال المواصفات وعروض الموردين قبل اعتماد المسؤول. نحتاج ملف مراجعة يوضح النواقص دون تنفيذ شراء.' : 'Purchase requests arrive through an internal form. The team checks specifications and supplier quotes before owner approval. We need a review file showing missing information without executing purchases.', systems: ar ? 'جدول طلبات افتراضي وسياسة اعتماد' : 'A fictional request spreadsheet and approval policy', volume: '100', minutes: '20' }); setNotice(''); }}>{ar ? 'استخدم مثالًا افتراضيًا' : 'Use a fictional example'}</button></div><div className="upgrade-brief-grid">{(['name', 'email', 'company', 'process', 'systems'] as const).map((key, i) => <div key={key} className={key === 'process' || key === 'systems' ? 'wide' : ''}><label htmlFor={`brief-${key}`}>{fields[i]}</label>{key === 'process' || key === 'systems' ? <textarea id={`brief-${key}`} name={key} value={values[key]} onChange={e => update(key, e.target.value)} rows={key === 'process' ? 5 : 2} minLength={key === 'process' ? 3 : undefined} maxLength={6000} required={key === 'process'}/> : <input id={`brief-${key}`} name={key} type={key === 'email' ? 'email' : 'text'} value={values[key]} onChange={e => update(key, e.target.value)} required={key !== 'company'} maxLength={254} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'organization'} dir={key === 'email' ? 'ltr' : undefined}/>}</div>)}<div className="wide"><label htmlFor="brief-engagement">{shared.engagementType}<span className="brief-optional">{shared.optional}</span></label><select id="brief-engagement" name="engagement" value={values.engagement} onChange={e => update('engagement', e.target.value)}><option value="">{ar ? 'نحدد النطاق معًا' : 'Define the scope together'}</option>{engagementIds.map(id => <option value={id} key={id}>{engagementLabel(id)}</option>)}</select></div></div><p className="upgrade-brief-help">{masterValue(copy.sections, 'نص المساعدة', 'Helper')}</p><details><summary>{ar ? 'حساب العبء الحالي، اختياري' : 'Current workload, optional'}</summary><div className="upgrade-brief-grid" style={{ marginTop: 20 }}>{(['volume', 'minutes'] as const).map(key => <div key={key}><label htmlFor={`brief-${key}`}>{key === 'volume' ? (ar ? 'الحالات شهريًا' : 'Cases per month') : (ar ? 'الدقائق الحالية لكل حالة' : 'Current minutes per case')}</label><input id={`brief-${key}`} inputMode="decimal" value={values[key]} maxLength={20} onChange={e => update(key, e.target.value)}/></div>)}</div></details><p className="upgrade-brief-help">{masterValue(copy.sections, 'للمسار المحلي الحالي', 'For the current local flow')}</p><div className="upgrade-actions"><button type="submit" className="upgrade-button">{buttons[0]}<ArrowUpRight size={18}/></button><button type="button" className="upgrade-button secondary" onClick={() => { setValues(empty); syncEngagement(''); setText(''); setNotice(ar ? 'تم مسح الموجز.' : 'Brief cleared.'); }}>{buttons[3]}</button></div><a href={`mailto:${contactEmail}`} className="upgrade-text-link" dir="ltr">{contactEmail}</a></div>
 {text && <section className="upgrade-card upgrade-brief-result" aria-labelledby="brief-result-title"><h2 id="brief-result-title">{ar ? 'الموجز الكامل للمراجعة' : 'Complete brief for review'}</h2><label htmlFor="brief-preview" className="sr-only">{ar ? 'الموجز' : 'Brief'}</label><textarea id="brief-preview" readOnly value={text} rows={12}/><div className="upgrade-actions"><button type="button" className="upgrade-button" onClick={download}><Download size={18}/>{buttons[1]}</button><button type="button" className="upgrade-button secondary" onClick={async () => { try {
        await navigator.clipboard.writeText(text);
        setNotice(ar ? 'نُسخ الموجز الكامل.' : 'Complete brief copied.');
    }
    catch {
        setNotice(ar ? 'تعذر النسخ تلقائيًا. حدد النص وانسخه أو نزّل الملف.' : 'Copy failed. Select the text and copy it, or download the file.');
    } }}><Copy size={18}/>{ar ? 'انسخ الموجز' : 'Copy brief'}</button><a className="upgrade-button secondary" href={draft.href}><Mail size={18}/>{buttons[2]}</a></div>{draft.requiresAttachment && <p className="upgrade-brief-help">{ar ? 'نزّل الملف وأرفقه يدويًا في مسودة البريد؛ لا نختصر الموجز الطويل في الرابط.' : 'Download and attach the file manually; long briefs are not truncated into the email link.'}</p>}</section>}
 <p role="status" aria-live="polite" className={notice ? 'upgrade-form-notice' : ''}>{notice}</p></form>;
}

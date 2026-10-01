import { Check, ArrowDown, FileText, ScanLine, ShieldCheck, Workflow } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

/** Illustrative design only: never presents a live run, approval, or integration. */
export function WorkflowPreview({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const steps = [
    { icon: FileText, title: ar ? "طلب شراء جديد" : "New purchase request", detail: ar ? "الهدف · البيانات · صاحب القرار" : "Goal · data · decision owner" },
    { icon: ScanLine, title: ar ? "فهم الطلب" : "Understand the request", detail: ar ? "ما المعلومات الناقصة؟" : "What information is missing?" },
    { icon: Workflow, title: ar ? "تصميم مسار العمل" : "Design the workflow", detail: ar ? "خطوات واضحة وحدود للصلاحيات" : "Clear steps and scoped permissions" },
    { icon: ShieldCheck, title: ar ? "مراجعة قبل الربط" : "Review before connecting", detail: ar ? "خطة مقترحة، بدون تنفيذ شراء" : "Proposed plan, no purchase executed" },
  ];
  return <div data-workflow-preview className="workflow-preview relative rounded-2xl border border-border bg-card text-start shadow-2xl shadow-black/25">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
      <span className="flex items-center gap-2 text-sm font-medium"><span className="size-2 rounded-full bg-primary" />{ar ? "من الطلب إلى خطة واضحة" : "From request to a clear plan"}</span>
      <span className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-muted-foreground">{ar ? "مثال توضيحي" : "Illustrative example"}</span>
    </div>
    <ol className="px-5 py-5 sm:px-7">{steps.map((step, index) => <li key={step.title}>
      <div className={`flex items-center gap-4 rounded-xl border p-4 ${index === 2 ? "border-primary/40 bg-primary/5" : "border-border bg-background/50"}`}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary"><step.icon className="size-5" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1"><p className="text-sm font-medium leading-6">{step.title}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{step.detail}</p></div>
        <span className="font-mono text-xs text-muted-foreground">0{index+1}</span>
      </div>
      {index < steps.length - 1 && <div className="flex h-7 items-center justify-center text-muted-foreground"><ArrowDown className="size-4" aria-hidden="true" /></div>}
    </li>)}</ol>
    <div className="flex items-start gap-2 border-t border-border px-5 py-4 text-xs leading-6 text-muted-foreground"><Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />{ar ? "التجربة تصمم وتراجع. ربط أنظمة المؤسسة مرحلة لاحقة." : "The preview designs and reviews. Enterprise connections are a later stage."}</div>
  </div>;
}

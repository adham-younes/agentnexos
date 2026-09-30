"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale, useT } from "@/lib/i18n/use-t";

const asciiPattern = Array.from({ length: 60 }, (_, row) =>
  Array.from({ length: 100 }, (_, column) =>
    (row * 100 + column) % 7 === 0 ? '"' : ' '
  ).join("")
).join("\n");

export function TestimonialsSection() {
  const t = useT();
  const locale = useLocale();
  const measures = locale === "ar" ? [
    ["جودة النتيجة", "هل اكتملت المدخلات؟ هل النتيجة صحيحة ومسنودة بمصدر يمكن مراجعته؟"],
    ["زمن الدورة", "قارن زمن وصول الطلب إلى نتيجة معتمدة بالمسار اليدوي لنفس النوع من العمل."],
    ["تدخل المسؤول", "سجل أين احتاج النظام سؤالًا أو تصحيحًا أو اعتمادًا، بدل إخفاء العمل البشري."],
    ["سلامة التنفيذ", "اختبر الصلاحيات والتكرار والانقطاع والتعافي، وتحقق من أثر الفعل في النظام النهائي."],
  ] : [
    ["Result quality", "Are inputs complete and the result correct, with a source the owner can inspect?"],
    ["Cycle time", "Compare the time from request to approved result with the manual path for the same task."],
    ["Owner intervention", "Record questions, corrections, and approvals instead of hiding the human contribution."],
    ["Execution safety", "Test permissions, duplicates, outages, and recovery; verify effects in the target system."],
  ];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-foreground text-background overflow-hidden"
    >
      {/* ASCII background pattern */}
      <div className="absolute inset-0 font-mono text-[10px] text-background/[0.02] leading-tight overflow-hidden whitespace-pre select-none">
        {asciiPattern}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-20">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-background/40 mb-4">
              <span className="w-12 h-px bg-background/20" />
              {t("testimonials.eyebrow", "Success criteria")}
            </span>
            <h2
              className={`text-4xl lg:text-5xl font-display transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("testimonials.title", "Business value you can measure.")}
            </h2>
          </div>


        </div>


          <div><p className="text-xl text-background/70 leading-relaxed max-w-2xl">
            {t("testimonials.note", "Before we build, we define the workflow baseline and the quality, cycle-time, cost, and human-intervention measures. We only publish customer outcomes when they are verified.")}
          </p><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{measures.map(([title, description], i) => <article key={title} className="border-t border-background/20 pt-6"><span className="text-xs font-mono text-background/50">0{i+1}</span><h3 className="mt-5 text-xl font-medium">{title}</h3><p className="mt-3 text-sm leading-7 text-background/65">{description}</p></article>)}</div></div>
      </div>

    </section>
  );
}

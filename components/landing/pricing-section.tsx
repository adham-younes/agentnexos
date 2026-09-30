"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Zap } from "lucide-react";
import { useLocale, useT } from "@/lib/i18n/use-t";

// Commercial plans are placeholders. Nothing is on sale yet, so the section
// stays hidden unless explicitly enabled (docs/GUARDRAILS.md §6).
const showPlaceholders =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS === "true";

const plans = [
  {
    key: "pricing.plan1",
    price: { monthly: 0, annual: 0 },
    ctaKey: "pricing.cta1",
    features: 4,
    highlight: false,
  },
  {
    key: "pricing.plan2",
    price: { monthly: 79, annual: 65 },
    ctaKey: "pricing.cta2",
    features: 4,
    highlight: true,
  },
  {
    key: "pricing.plan3",
    price: null,
    ctaKey: "pricing.cta3",
    features: 4,
    highlight: false,
  },
];

export function PricingSection() {
  const t = useT();
  const locale = useLocale();
  const stages = locale === "ar" ? [
    ["اكتشاف العملية", "نحدد مالك العملية ومدخلاتها ومواضع التعطل ومصدر الحقيقة.", "التسليم: نطاق أولي وأسئلة البيانات ومعيار قبول واضح."],
    ["تجربة محدودة", "نختبر حالات افتراضية ثم بيانات مصرحًا بها؛ تبدأ الأدوات بالقراءة والمراجعة.", "التسليم: نتائج اختبار ومخاطر وحدود قبل أي كتابة خارجية."],
    ["ربط وتشغيل تدريجي", "نربط النظام المعتمد ونختبر الموافقات والتعافي ونقيس العملية الواقعية.", "التسليم: نطاق تشغيل موثق وخطة مراقبة ودعم واتفاق تكلفة."],
  ] : [
    ["Discover the workflow", "Define the process owner, inputs, bottlenecks, and source of truth.", "Deliverable: initial scope, data questions, and clear acceptance criteria."],
    ["Validate a bounded pilot", "Test fictional cases, then authorized data. Start tools with reading and review.", "Deliverable: test results, risks, and boundaries before any external write."],
    ["Connect and roll out", "Connect the approved system, test approvals and recovery, and measure the actual process.", "Deliverable: documented operating scope, monitoring, support, and an agreed cost."],
  ];
  const [isAnnual, setIsAnnual] = useState(true);
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
    <section id="pricing" ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-12 h-px bg-foreground/30" />
              {t("pricing.eyebrow", "Engagement model")}
            </span>
            <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {t("pricing.title1", "Start with one workflow,")}
              <br />
              <span className="text-stroke">{t("pricing.title2", "build with confidence.")}</span>
            </h2>
          </div>

          <div className="lg:col-span-5 relative self-center p-0 aspect-[4/3] w-full">
            <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <img
                src="/images/whale.png"
                alt="Organic whale"
                className="w-full h-full object-contain object-center"
              />
            </div>
          </div>
        </div>

        {!showPlaceholders ? (
          <div><p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t("pricing.roadmapNote", "We begin with discovery, move to a bounded pilot with explicit success criteria, then deploy in measured production stages. Scope and cost follow the systems, risks, and integrations involved.")}
          </p><div className="mt-12 grid gap-6 lg:grid-cols-3">{stages.map(([title,description,deliverable],i)=><article key={title} className="border border-foreground/15 p-6 lg:p-8"><span className="text-xs font-mono text-muted-foreground">0{i+1}</span><h3 className="mt-6 text-xl font-medium">{title}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p><p className="mt-6 border-t border-foreground/15 pt-5 text-sm leading-7">{deliverable}</p></article>)}</div></div>
        ) : (
          <>
            <div className="relative">
              <div className="grid lg:grid-cols-3 gap-4 lg:gap-0">
                {plans.map((plan, index) => (
                  <div
                    key={plan.key}
                    className={`relative bg-background border transition-all duration-700 ${
                      plan.highlight
                        ? "border-foreground lg:-mx-2 lg:z-10 lg:scale-105"
                        : "border-foreground/10 lg:first:-mr-2 lg:last:-ml-2"
                    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-4 left-8 right-8 flex justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest">
                          <Zap className="w-3 h-3" />
                          {t("pricing.popular", "Most Popular")}
                        </span>
                      </div>
                    )}

                    <div className="p-8 lg:p-10">
                      <div className="mb-8 pb-8 border-b border-foreground/10">
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-display mt-2">
                          {t(`${plan.key}.name`, "")}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t(`${plan.key}.tagline`, "")}
                        </p>
                      </div>

                      <div className="mb-8">
                        {plan.price !== null ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl lg:text-6xl font-display">
                              ${isAnnual ? plan.price.annual : plan.price.monthly}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {t("pricing.perMonth", "/month")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-4xl font-display">
                            {t(`${plan.key}.price`, "Custom")}
                          </span>
                        )}
                        {plan.price !== null && plan.price.monthly > 0 && (
                          <p className="text-xs text-muted-foreground mt-2 font-mono">
                            {isAnnual
                              ? t("pricing.billedAnnually", "billed annually")
                              : t("pricing.billedMonthly", "billed monthly")}
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-10">
                        {Array.from({ length: plan.features }, (_, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#eca8d6] mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {t(`${plan.key}.c${i + 1}`, "")}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all group ${
                          plan.highlight
                            ? "bg-foreground text-background hover:bg-foreground/90"
                            : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5"
                        }`}
                      >
                        {t(plan.ctaKey, "")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-12 border-t border-foreground/10 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#eca8d6]" />
                  {t("security.2.title", "")}
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#eca8d6]" />
                  {t("security.3.title", "")}
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#eca8d6]" />
                  {t("metrics.routing", "")}
                </span>
              </div>
              <a href={`/${locale}/start`} className="text-sm underline underline-offset-4 hover:text-foreground transition-colors">
                {t("pricing.compare", "Compare all features")}
              </a>
            </div>

            <p className="mt-8 text-xs font-mono text-muted-foreground">
              {t("pricing.roadmapNote", "")}
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 1.5px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}

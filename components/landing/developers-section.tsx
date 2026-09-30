"use client";

import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n/use-t";

const features = [
  {
    key: "dev.1",
    title: "Explicit tool contracts",
    description: "Testable inputs, outputs, and permissions for every tool."
  },
  {
    key: "dev.2",
    title: "Traceable state",
    description: "Every step, decision, and result leaves a reviewable event."
  },
  {
    key: "dev.3",
    title: "Model flexibility",
    description: "Choose by quality, cost, and policy without binding business logic to one provider."
  },
  {
    key: "dev.4",
    title: "Pre-production evaluation",
    description: "Acceptance scenarios measure behaviour before expansion."
  },
];

export function DevelopersSection() {
  const t = useT();
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
    <section id="developers" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">

      {/* Image — absolute, bottom-right, behind all content */}
      <div
        className={`absolute bottom-0 end-0 w-full aspect-square max-h-[650px] lg:w-[55%] pointer-events-none transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
                  width={2720}
                  height={1536}
                  loading="lazy"
                  decoding="async"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain object-bottom"
        />
        {/* Fade left edge */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent rtl:bg-gradient-to-l" />
        {/* Fade top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* All text content sits on top */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — Full width */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t("dev.eyebrow", "Agent engineering")}
          </span>
          <h2 className="text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9]">
            {t("dev.title1", "Explicit logic.")}
            <br />
            <span className="text-muted-foreground">{t("dev.title2", "Observable operation.")}</span>
          </h2>
        </div>

        {/* Description + Features — left half only */}
        <div
          className={`max-w-full lg:max-w-[50%] transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-md">
            {t("dev.lead", "We engineer each system with explicit tool contracts, traceable state, execution policies, and evaluations that gate production.")}
          </p>
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 50 + 200}ms` }}
              >
                <h3 className="font-medium mb-1">{t(`${feature.key}.title`, feature.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(`${feature.key}.desc`, feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

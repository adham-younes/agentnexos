"use client";

import { useEffect, useState, useRef } from "react";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";

const securityFeatures = [
  {
    icon: Shield,
    key: "security.1",
    title: "Defined execution scope",
    description: "Define permitted tools and connections. Code execution requires isolation and independent testing.",
    image: "/images/isolated.jpg",
  },
  {
    icon: Lock,
    key: "security.2",
    title: "Clear data policy",
    description: "Agree on transmitted data, retention, and hosting before connecting enterprise information.",
    image: "/images/encrypted.jpg",
  },
  {
    icon: Eye,
    key: "security.3",
    title: "Reviewable result evidence",
    description: "Verify execution against the connected system, not a model's message or a local receipt.",
    image: "/images/audit.jpg",
  },
  {
    icon: FileCheck,
    key: "security.4",
    title: "Permission boundaries",
    description: "Principle of least privilege by design.",
    image: "/images/permissions.jpg",
  },
];

const controlPrinciples = [
  { key: "security.control.leastPrivilege", label: "Least privilege" },
  { key: "security.control.humanApproval", label: "Human approval" },
  { key: "security.control.auditEvents", label: "Audit events" },
  { key: "security.control.isolation", label: "Isolation" },
];

export function SecuritySection() {
  const t = useT();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % securityFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="security" ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background accent removed */}
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <span className="w-12 h-px bg-foreground/20" />
            {t("security.eyebrow", "Security")}
          </span>
          
          {/* Title — full width */}
          <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            {t("security.title1", "Autonomous,")}
            <br />
            <span className="text-muted-foreground">{t("security.title2", "not uncontrolled.")}</span>
          </h2>
          
          {/* Description — below title */}
          <div className={`transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("security.lead", "Define permitted data, decision owners, and review requirements. These controls must be built and tested for each project; they are not a certification of readiness or compliance.")}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Large visual card */}
          <div className={`lg:col-span-7 relative p-8 lg:p-12 border border-foreground/10 min-h-[400px] overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            {/* Dynamic feature image with cross-fade — desktop only */}
            <div className="absolute inset-0 pointer-events-none items-center justify-end hidden lg:flex">
              {securityFeatures.map((feature, index) => (
                <img
                  width={840}
                  height={840}
                  loading="lazy"
                  decoding="async"
                  key={feature.image}
                  src={feature.image}
                  alt={feature.title}
                  className="absolute h-3/4 w-3/4 object-contain object-right transition-opacity duration-500"
                  style={{ opacity: activeFeature === index ? 0.85 : 0 }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <span className="font-mono text-sm text-muted-foreground">{t("security.active", "Active protection")}</span>
              <div className="mt-8">
                <span className="text-7xl lg:text-8xl font-display">04</span>
                <span className="block text-muted-foreground mt-2">
                  {t("security.integrityTitle", "Execution integrity")}
                </span>
                <span className="block text-xs text-muted-foreground/70 mt-1 max-w-xs">
                  {t("security.integrityNote", "Certifications are on the roadmap.")}
                </span>
              </div>
            </div>
            
            {/* Certification badges */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
              {controlPrinciples.map((principle, index) => (
                <span
                  key={principle.key}
                  className={`px-3 py-1 border border-foreground/10 text-xs font-mono text-muted-foreground transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  {t(principle.key, principle.label)} · {t("security.complianceNote", "design principle")}
                </span>
              ))}
            </div>
          </div>

          {/* Feature cards stack */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                role="button"
                tabIndex={0}
                aria-pressed={activeFeature === index}
                onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveFeature(index); } }}
                className={`p-6 border transition-all duration-500 cursor-default ${
                  activeFeature === index 
                    ? "border-foreground/30 bg-foreground/[0.04]" 
                    : "border-foreground/10"
                } ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 rtl:-translate-x-8"}`}
                style={{ transitionDelay: `${index * 80}ms` }}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-10 h-10 flex items-center justify-center border transition-colors ${
                    activeFeature === index 
                      ? "border-foreground bg-foreground text-background" 
                      : "border-foreground/20"
                  }`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t(`${feature.key}.title`, feature.title)}</h3>
                    <p className="text-sm text-muted-foreground">{t(`${feature.key}.desc`, feature.description)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

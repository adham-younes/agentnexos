"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useT, useLocale } from "@/lib/i18n/use-t";

// Navigation labels are resolved from the dictionary via key; hrefs stay fixed.
const footerLinks = {
  footer: { titleKey: "footer.products", title: "Product", links: [
    { nameKey: "footer.capabilities", name: "Agent capabilities", href: "/solutions" },
    { nameKey: "footer.howItWorks", name: "How it works", href: "#how-it-works" },
    { nameKey: "footer.pricing", name: "Delivery approach", href: "#pricing" },
    { nameKey: "footer.integrations", name: "Integrations", href: "#integrations" },
  ] },
  developers: { titleKey: "footer.sdk", title: "Engineering & guides", links: [
    { nameKey: "footer.docs", name: "Agent Space", href: "/agentnexos" },
    { nameKey: "footer.sdk", name: "Platform engineering", href: "/platform" },
    { nameKey: "footer.api", name: "Practical guides", href: "/resources" },
    { nameKey: "footer.status", name: "Success criteria", href: "/resources#acceptance" },
  ] },
  company: { titleKey: "footer.company", title: "Company", links: [
    { nameKey: "footer.about", name: "About", href: "/about" },
    { nameKey: "footer.blog", name: "Architecture", href: "/platform" },
    { nameKey: "footer.careers", name: "Industries", href: "/industries" },
    { nameKey: "footer.contact", name: "Project brief", href: "/start" },
  ] },
  legal: { titleKey: "footer.legal", title: "Legal", links: [
    { nameKey: "footer.privacy", name: "Privacy", href: "/privacy" },
    { nameKey: "footer.terms", name: "Terms", href: "/terms" },
    { nameKey: "footer.security", name: "Security", href: "/security" },
  ] },
};

const socialLinks = [
  { key: "footer.capabilities", name: "Capabilities", href: "#features" },
  { key: "footer.howItWorks", name: "Process", href: "#how-it-works" },
  { key: "footer.security", name: "Security", href: "#security" },
];

function AnimatedWaveCanvas() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      if (!reducedMotion) animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection() {
  const t = useT();
  const locale = useLocale();
  const resolveHref = (href: string) => (href.startsWith("/") ? `/${locale}${href}` : href);

  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
                  width={2720}
                  height={811}
                  loading="lazy"
                  decoding="async"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#top" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-white">
                  {t("footer.brand", "Agentnexos")}
                </span>
                <span className="text-xs text-white/40 font-mono">TM</span>
              </a>

              <p className="text-white/50 leading-relaxed mb-8 max-w-xs text-sm">
                {t("footer.tagline", "Custom AI agent systems for MENA enterprises, built to automate real operations with explicit controls.")}
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {t(link.key, link.name)}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-90" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([key, column]) => (
              <div key={key}>
                <h3 className="text-sm font-medium text-white mb-6">
                  {t(column.titleKey, column.title)}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.nameKey}>
                      <a
                        href={resolveHref(link.href)}
                        className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {t(link.nameKey, link.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            {t("footer.copyright", "\u00a9 2026 Agentnexos. All rights reserved.")}
          </p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              {t("footer.operational", "Platform under staged development")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

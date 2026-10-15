"use client";
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

export function CyberEffects({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    function configure() {
      observer?.disconnect();
      const items = element!.querySelectorAll<HTMLElement>("[data-reveal]");
      if (media.matches || !("IntersectionObserver" in window)) {
        element!.classList.remove("motion-ready");
        items.forEach(item => item.classList.add("is-visible"));
        return;
      }
      element!.classList.add("motion-ready");
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer?.unobserve(entry.target); } });
      }, { threshold: 0 });
      items.forEach(item => observer!.observe(item));
    }
    configure(); element.dataset.effectsReady = "true"; media.addEventListener("change", configure);
    return () => { observer?.disconnect(); media.removeEventListener("change", configure); };
  }, []);
  return <div ref={root} className={`nexus ${className}`}><div className="nexus-atmosphere" aria-hidden="true"><i /><i /></div>{children}</div>;
}

export function Glass({ children, className = "", reveal = true }: { children: ReactNode; className?: string; reveal?: boolean }) {
  function move(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
  }
  return <div onPointerMove={move} data-reveal={reveal || undefined} className={`nexus-glass ${className}`}>{children}</div>;
}

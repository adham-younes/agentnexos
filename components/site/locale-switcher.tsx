"use client";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/use-t";
/** Swaps the locale segment of the current path, preserving everything else. */
function swapLocale(pathname: string, next: Locale): string {
    const parts = pathname.split("/");
    parts[1] = next;
    return parts.join("/") || `/${next}`;
}
export function LocaleSwitcher({ inverted = false, compact = false }: {
    inverted?: boolean;
    compact?: boolean;
}) {
    const locale = useLocale();
    const pathname = usePathname() || "/";
    return (<div className="upgrade-locale-switcher">
      {locales.filter(l => !compact || l !== locale).map((l) => {
            const active = l === locale;
            return (<a key={l} href={swapLocale(pathname, l)} onClick={event => { event.currentTarget.search = window.location.search; event.currentTarget.hash = window.location.hash; }} onAuxClick={event => { event.currentTarget.search = window.location.search; event.currentTarget.hash = window.location.hash; }} lang={l} aria-label={l === "ar" ? "العربية" : "English"} aria-current={active ? "true" : undefined} className={active
                    ? inverted
                        ? "text-white underline decoration-white/60 underline-offset-4"
                        : "text-foreground underline underline-offset-4"
                    : inverted
                        ? "text-white/55 hover:text-white transition-colors"
                        : "text-muted-foreground hover:text-foreground transition-colors"}>
            {l === "ar" ? "ع" : "EN"}
          </a>);
        })}
    </div>);
}

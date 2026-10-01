"use client";

import { usePathname } from "next/navigation";
import { localeLabel, locales, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/use-t";

/** Swaps the locale segment of the current path, preserving everything else. */
function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}

export function LocaleSwitcher({ inverted = false }: { inverted?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname() || "/";

  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={swapLocale(pathname, l)}
            onClick={event=>{event.currentTarget.href=swapLocale(pathname,l)+window.location.search+window.location.hash;}}
            aria-current={active ? "true" : undefined}
            className={"inline-flex min-h-11 items-center px-1 " + (
              active
                ? inverted
                  ? "text-white underline decoration-white/60 underline-offset-4"
                  : "text-foreground underline underline-offset-4"
                : inverted
                  ? "text-white/55 hover:text-white transition-colors"
                  : "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            {localeLabel[l]}
          </a>
        );
      })}
    </div>
  );
}

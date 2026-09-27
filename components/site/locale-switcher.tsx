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

export function LocaleSwitcher() {
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
            aria-current={active ? "true" : undefined}
            className={
              active
                ? "text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {localeLabel[l]}
          </a>
        );
      })}
    </div>
  );
}

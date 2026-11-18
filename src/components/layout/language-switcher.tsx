"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

/** Slugs are not localized, so the same path exists in every language. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|nl)(?=\/|$)/, "");
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded px-2 py-1 uppercase ${l === locale ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}

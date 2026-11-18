import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import type { SiteSettings } from "@/lib/contentful";
import { getDictionary, type Locale } from "@/lib/i18n";
import { EntryLink } from "../entry-link";
import { LanguageSwitcher } from "./language-switcher";

type NavItem = NonNullable<NonNullable<NonNullable<SiteSettings["fields"]["mainNavigation"]>["fields"]["items"]>[number]>;

function NavLabel({ item, locale, className }: { item: NavItem; locale: Locale; className?: string }) {
  return (
    <EntryLink entry={item.fields.internalLink} url={item.fields.url} newTab={item.fields.openInNewTab} locale={locale} className={className}>
      {item.fields.label}
    </EntryLink>
  );
}

export function Header({ settings, locale }: { settings?: SiteSettings; locale: Locale }) {
  const t = getDictionary(locale);
  const items = (settings?.fields.mainNavigation?.fields.items ?? []).filter(Boolean) as NavItem[];
  const logo = settings?.fields.logo?.fields.file?.url;

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="shrink-0">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- SVG logo served as-is from Contentful
            <img src={`https:${logo}`} alt={settings?.fields.siteName ?? "Home"} width={200} height={40} className="h-9 w-auto" />
          ) : (
            <span className="font-display text-xl">{settings?.fields.siteName}</span>
          )}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const children = (item.fields.children ?? []).filter(Boolean) as NavItem[];
              return (
                <li key={item.sys.id} className="group relative">
                  <div className="flex items-center gap-1 rounded-md px-3 py-2 text-ink/80 group-hover:text-ink">
                    <NavLabel item={item} locale={locale} className="font-medium" />
                    {children.length > 0 && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </div>
                  {children.length > 0 && (
                    <ul className="invisible absolute left-0 top-full min-w-56 rounded-xl border border-sand-200 bg-white p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {children.map((child) => (
                        <li key={child.sys.id}>
                          <NavLabel item={child} locale={locale} className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand-100 hover:text-ink" />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={t.language} />
          {/* Mobile navigation */}
          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-md p-2" aria-label={t.menu}>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-full mt-2 max-h-[75vh] w-72 overflow-y-auto rounded-xl border border-sand-200 bg-white p-4 shadow-xl">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.sys.id}>
                    <NavLabel item={item} locale={locale} className="font-semibold text-ink" />
                    <ul className="mt-1 space-y-1 pl-3">
                      {((item.fields.children ?? []).filter(Boolean) as NavItem[]).map((child) => (
                        <li key={child.sys.id}>
                          <NavLabel item={child} locale={locale} className="text-sm text-ink/70" />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

import type { SiteSettings } from "@/lib/contentful";
import type { Locale } from "@/lib/i18n";
import { EntryLink } from "../entry-link";

export function Footer({ settings, locale }: { settings?: SiteSettings; locale: Locale }) {
  // Top-level footer items without a link are column headings.
  const columns = (settings?.fields.footerNavigation?.fields.items ?? []).filter(Boolean);
  const social = (settings?.fields.socialLinks ?? {}) as Record<string, string>;

  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) =>
          column ? (
            <div key={column.sys.id}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{column.fields.label}</h2>
              <ul className="mt-4 space-y-2">
                {(column.fields.children ?? []).map((item) =>
                  item ? (
                    <li key={item.sys.id}>
                      <EntryLink entry={item.fields.internalLink} url={item.fields.url} newTab={item.fields.openInNewTab} locale={locale} className="hover:text-white">
                        {item.fields.label}
                      </EntryLink>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ) : null,
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{settings?.fields.footerText}</p>
          <ul className="flex gap-4">
            {Object.entries(social).map(([network, url]) => (
              <li key={network}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-white">
                  {network}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

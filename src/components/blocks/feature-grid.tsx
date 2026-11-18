import type { TypeFeatureGrid } from "@/types/contentful";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Icon } from "../icon";
import { EntryLink } from "../entry-link";

const COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

type Props = { entry: TypeFeatureGrid<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function FeatureGrid({ entry, locale }: Props) {
  const { heading, intro, columns = 3, items } = entry.fields;
  const t = getDictionary(locale);
  return (
    <section className="container-page py-14">
      {heading && <h2 className="section-title">{heading}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-lg text-ink/70">{intro}</p>}
      <div className={`mt-10 grid gap-6 ${COLUMNS[columns] ?? COLUMNS[3]}`}>
        {items.map((item) =>
          item ? (
            <div key={item.sys.id} className="rounded-2xl border border-sand-200 bg-white p-6">
              <Icon name={item.fields.icon} className="h-8 w-8 text-ocean-600" />
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.fields.title}</h3>
              {item.fields.description && <p className="mt-2 text-ink/70">{item.fields.description}</p>}
              {item.fields.link && (
                <EntryLink entry={item.fields.link} locale={locale} className="mt-4 inline-block font-medium text-ocean-700 hover:underline">
                  {t.readMore} →
                </EntryLink>
              )}
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}

import type { TypeContentGrid } from "@/types/contentful";
import { getArticles, getDestinations, type Article, type Destination } from "@/lib/contentful";
import type { Locale } from "@/lib/i18n";
import { isTypeArticle, isTypeDestination } from "@/types/contentful";
import { ArticleCard, DestinationCard } from "../cards";

type Props = { entry: TypeContentGrid<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

/** Cards picked by hand, or filled by a query depending on `mode`. */
export async function ContentGrid({ entry, locale }: Props) {
  const { heading, mode, manualItems, category, limit = 3 } = entry.fields;

  let items: (Article | Destination)[] = [];
  switch (mode) {
    case "latestArticles":
      items = (await getArticles(locale, { limit })).items;
      break;
    case "featuredDestinations":
      items = (await getDestinations(locale, { featured: true, limit })).items;
      break;
    case "category":
      items = category ? (await getArticles(locale, { limit, categoryId: category.sys.id })).items : [];
      break;
    default:
      items = (manualItems ?? []).filter(Boolean).slice(0, limit) as (Article | Destination)[];
  }
  if (!items.length) return null;

  return (
    <section className="container-page py-14">
      {heading && <h2 className="section-title">{heading}</h2>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) =>
          isTypeArticle(item) ? (
            <ArticleCard key={item.sys.id} article={item as Article} locale={locale} />
          ) : isTypeDestination(item) ? (
            <DestinationCard key={item.sys.id} destination={item as Destination} locale={locale} />
          ) : null,
        )}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestinations } from "@/lib/contentful";
import { getDictionary, hasLocale, regionLabel } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { DestinationCard } from "@/components/cards";
import { RegionFilter } from "@/components/region-filter";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/destinations">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/destinations", title: t.destinations, description: t.destinationsIntro });
}

export default async function DestinationsPage({ params }: PageProps<"/[locale]/destinations">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { items } = await getDestinations(locale);
  const regions = [...new Set(items.map((d) => d.fields.region))].sort();

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl text-ink md:text-5xl">{t.destinations}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/70">{t.destinationsIntro}</p>
      <RegionFilter
        allLabel={t.allRegions}
        regions={regions.map((r) => ({ value: r, label: regionLabel(r, locale) }))}
        items={items.map((d) => ({ id: d.sys.id, region: d.fields.region, card: <DestinationCard destination={d} locale={locale} /> }))}
      />
    </div>
  );
}

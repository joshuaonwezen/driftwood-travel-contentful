import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { getAllDestinationRefs, getArticles, getDestinationBySlug } from "@/lib/contentful";
import { formatPrice, getDictionary, hasLocale, monthLabel, regionLabel } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { ArticleCard } from "@/components/cards";
import { ContentfulImage } from "@/components/contentful-image";
import { Markdown } from "@/components/markdown";
import { RichText } from "@/components/rich-text";

export const revalidate = 3600;

type Highlight = { title: string; description: string };

export async function generateStaticParams() {
  return (await getAllDestinationRefs()).map((d) => ({ slug: d.fields.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/destinations/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const destination = await getDestinationBySlug(slug, locale);
  if (!destination) return {};
  return pageMetadata({
    locale,
    path: `/destinations/${slug}`,
    seo: destination.fields.seo,
    title: destination.fields.name,
    description: destination.fields.summary,
    image: destination.fields.heroImage,
  });
}

export default async function DestinationPage({ params }: PageProps<"/[locale]/destinations/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const destination = await getDestinationBySlug(slug, locale);
  if (!destination) notFound();

  const t = getDictionary(locale);
  const f = destination.fields;
  const highlights = Array.isArray(f.highlights) ? (f.highlights as Highlight[]) : [];
  const { items: stories } = await getArticles(locale, { destinationId: destination.sys.id, limit: 6 });
  const { lat, lon } = f.location;
  const bbox = [lon - 0.25, lat - 0.15, lon + 0.25, lat + 0.15].join(",");

  return (
    <>
      <section className="relative isolate flex min-h-[60vh] items-end overflow-hidden">
        <ContentfulImage asset={f.heroImage} fill sizes="100vw" className="-z-20 object-cover" priority />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-900/90 via-ocean-900/30 to-transparent" />
        <div className="container-page pb-12 text-white">
          <p className="flex items-center gap-1 text-white/80">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {f.country} · {regionLabel(f.region, locale)}
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">{f.name}</h1>
          {f.tagline && <p className="mt-3 text-xl text-white/90">{f.tagline}</p>}
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_20rem]">
        <div>
          {f.summary && <p className="text-xl leading-relaxed text-ink/80">{f.summary}</p>}
          <RichText document={f.description} locale={locale} className="mt-8" />

          {highlights.length > 0 && (
            <section className="mt-12">
              <h2 className="section-title">{t.highlights}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {highlights.map((h) => (
                  <li key={h.title} className="rounded-2xl bg-sand-100 p-5">
                    <h3 className="font-semibold text-ink">{h.title}</h3>
                    <p className="mt-2 text-sm text-ink/70">{h.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {f.gallery && f.gallery.length > 0 && (
            <section className="mt-12">
              <h2 className="section-title">{t.gallery}</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {f.gallery.map((asset) =>
                  asset ? (
                    <div key={asset.sys.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <ContentfulImage asset={asset} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                    </div>
                  ) : null,
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-sand-200 bg-white p-6">
            {f.priceFrom !== undefined && (
              <p className="text-ink/60">
                {t.from} <span className="font-display text-3xl text-ink">{formatPrice(f.priceFrom, f.currency ?? "EUR", locale)}</span> {t.perPerson}
              </p>
            )}
            <dl className="mt-5 space-y-3 text-sm">
              {f.tripLengthDays && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ocean-600" aria-hidden="true" />
                  <dt className="sr-only">{t.days}</dt>
                  <dd>
                    {f.tripLengthDays} {t.days}
                  </dd>
                </div>
              )}
              {f.rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-clay" aria-hidden="true" />
                  <dt>{t.rating}:</dt>
                  <dd>{f.rating.toLocaleString(locale)} / 5</dd>
                </div>
              )}
              {f.bestMonths && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-ocean-600" aria-hidden="true" />
                  <dt>{t.bestMonths}:</dt>
                  <dd>{f.bestMonths.map((m) => monthLabel(m, locale)).join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>

          {f.travelTips && (
            <div className="rounded-2xl bg-sand-100 p-6">
              <h2 className="font-display text-2xl">{t.travelTips}</h2>
              <Markdown className="mt-3 text-base [&_h3]:mt-4 [&_h3]:text-base">{f.travelTips}</Markdown>
            </div>
          )}

          <div>
            <h2 className="sr-only">{t.location}</h2>
            <iframe
              title={`${t.location}: ${f.name}`}
              className="aspect-square w-full rounded-2xl border border-sand-200"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
            />
          </div>
        </aside>
      </div>

      {stories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="section-title">
            {t.storiesFrom} {f.name}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((a) => (
              <ArticleCard key={a.sys.id} article={a} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

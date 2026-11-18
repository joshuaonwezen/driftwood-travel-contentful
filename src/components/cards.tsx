import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Article, Destination } from "@/lib/contentful";
import { formatDate, formatPrice, getDictionary, regionLabel, type Locale } from "@/lib/i18n";
import { ContentfulImage } from "./contentful-image";
import { countWords } from "./rich-text";

export function readingTime(article: Article): number {
  return article.fields.readingTimeMinutes ?? Math.max(1, Math.round(countWords(article.fields.body) / 200));
}

export const isSponsored = (entry: { metadata?: { tags?: { sys: { id: string } }[] } }) =>
  !!entry.metadata?.tags?.some((tag) => tag.sys.id === "sponsored");

export function ArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  const t = getDictionary(locale);
  const { title, slug, excerpt, heroImage, categories, publishDate } = article.fields;
  const category = categories?.find(Boolean);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white transition hover:shadow-lg">
      <Link href={`/${locale}/blog/${slug}`} className="relative block aspect-[3/2] overflow-hidden">
        <ContentfulImage asset={heroImage} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        {isSponsored(article) && <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-white">{t.sponsored}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <Link href={`/${locale}/blog/category/${category.fields.slug}`} className="text-xs font-semibold uppercase tracking-wider" style={{ color: category.fields.color }}>
            {category.fields.name}
          </Link>
        )}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
          <Link href={`/${locale}/blog/${slug}`} className="hover:text-ocean-700">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 line-clamp-3 text-ink/70">{excerpt}</p>}
        <p className="mt-auto pt-4 text-sm text-ink/50">
          {formatDate(publishDate, locale)} · {readingTime(article)} {t.minRead}
        </p>
      </div>
    </article>
  );
}

export function DestinationCard({ destination, locale }: { destination: Destination; locale: Locale }) {
  const t = getDictionary(locale);
  const { name, slug, tagline, heroImage, country, region, priceFrom, currency } = destination.fields;
  return (
    <Link href={`/${locale}/destinations/${slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
      <ContentfulImage asset={heroImage} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/85 via-ocean-900/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="flex items-center gap-1 text-sm text-white/80">
          <MapPin className="h-4 w-4" aria-hidden="true" /> {country} · {regionLabel(region, locale)}
        </p>
        <h3 className="mt-1 font-display text-2xl">{name}</h3>
        {tagline && <p className="mt-1 text-white/85">{tagline}</p>}
        {priceFrom !== undefined && (
          <p className="mt-3 text-sm font-medium">
            {t.from} {formatPrice(priceFrom, currency ?? "EUR", locale)} {t.perPerson}
          </p>
        )}
      </div>
    </Link>
  );
}

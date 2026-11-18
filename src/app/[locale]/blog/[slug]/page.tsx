import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticleRefs, getArticleBySlug, type Article } from "@/lib/contentful";
import { formatDate, getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { ArticleCard, DestinationCard, isSponsored, readingTime } from "@/components/cards";
import { ContentfulImage } from "@/components/contentful-image";
import { RichText } from "@/components/rich-text";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllArticleRefs()).map((a) => ({ slug: a.fields.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    seo: article.fields.seo,
    title: article.fields.title,
    description: article.fields.excerpt,
    image: article.fields.heroImage,
    type: "article",
    publishedTime: article.fields.publishDate,
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();

  const t = getDictionary(locale);
  const { title, excerpt, heroImage, body, author, categories, destinations, publishDate, relatedArticles, tags } = article.fields;
  const related = (relatedArticles ?? []).filter(Boolean) as Article[];

  return (
    <article>
      <header className="container-page max-w-3xl pt-12">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {categories?.map((c) =>
            c ? (
              <Link key={c.sys.id} href={`/${locale}/blog/category/${c.fields.slug}`} className="font-semibold uppercase tracking-wider" style={{ color: c.fields.color }}>
                {c.fields.name}
              </Link>
            ) : null,
          )}
          {isSponsored(article) && <span className="rounded-full bg-clay px-3 py-0.5 text-xs font-semibold text-white">{t.sponsored}</span>}
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
        {excerpt && <p className="mt-4 text-xl text-ink/70">{excerpt}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink/60">
          {author && (
            <>
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <ContentfulImage asset={author.fields.avatar} fill sizes="40px" className="object-cover" />
              </div>
              <span>
                {t.by}{" "}
                <Link href={`/${locale}/authors/${author.fields.slug}`} className="font-medium text-ink hover:underline">
                  {author.fields.name}
                </Link>
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <time dateTime={publishDate}>{formatDate(publishDate, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>
            {readingTime(article)} {t.minRead}
          </span>
        </div>
      </header>

      <div className="container-page mt-10 max-w-5xl">
        <ContentfulImage asset={heroImage} sizes="(min-width: 1024px) 1024px, 100vw" className="h-auto w-full rounded-2xl" priority />
      </div>

      <div className="container-page max-w-3xl py-12">
        <RichText document={body} locale={locale} />
        {tags && tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-sand-100 px-3 py-1 text-sm text-ink/70">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {destinations && destinations.some(Boolean) && (
        <section className="container-page max-w-5xl pb-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (d ? <DestinationCard key={d.sys.id} destination={d} locale={locale} /> : null))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-page py-12">
          <h2 className="section-title">{t.relatedArticles}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.sys.id} article={r} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

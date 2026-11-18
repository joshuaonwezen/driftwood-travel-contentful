import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllAuthors, getArticles, getAuthorBySlug } from "@/lib/contentful";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { ArticleCard } from "@/components/cards";
import { ContentfulImage } from "@/components/contentful-image";
import { Markdown } from "@/components/markdown";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllAuthors()).map((a) => ({ slug: a.fields.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/authors/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const author = await getAuthorBySlug(slug, locale);
  if (!author) return {};
  return pageMetadata({ locale, path: `/authors/${slug}`, title: author.fields.name, description: author.fields.role, image: author.fields.avatar });
}

export default async function AuthorPage({ params }: PageProps<"/[locale]/authors/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const author = await getAuthorBySlug(slug, locale);
  if (!author) notFound();

  const t = getDictionary(locale);
  const { items } = await getArticles(locale, { authorId: author.sys.id, limit: 100 });
  const social = (author.fields.socialLinks ?? {}) as Record<string, string>;

  return (
    <div className="container-page py-14">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full">
          <ContentfulImage asset={author.fields.avatar} fill sizes="144px" className="object-cover" priority />
        </div>
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl text-ink">{author.fields.name}</h1>
          {author.fields.role && <p className="mt-1 text-lg text-ink/60">{author.fields.role}</p>}
          <Markdown className="mt-5">{author.fields.bio}</Markdown>
          <ul className="mt-5 flex gap-4 text-sm">
            {Object.entries(social).map(([network, url]) => (
              <li key={network}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-ocean-700 hover:underline">
                  {network}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {items.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title">
            {t.articlesBy} {author.fields.name}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((article) => (
              <ArticleCard key={article.sys.id} article={article} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getCategories } from "@/lib/contentful";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { ArticleCard } from "@/components/cards";
import { Icon } from "@/components/icon";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories("en")).map((c) => ({ slug: c.fields.slug }));
}

async function getCategory(slug: string, locale: Locale) {
  return (await getCategories(locale)).find((c) => c.fields.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/category/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const category = await getCategory(slug, locale);
  if (!category) return {};
  return pageMetadata({ locale, path: `/blog/category/${slug}`, title: category.fields.name, description: category.fields.description });
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/blog/category/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const category = await getCategory(slug, locale);
  if (!category) notFound();
  const t = getDictionary(locale);
  const { items } = await getArticles(locale, { categoryId: category.sys.id, limit: 100 });

  return (
    <div className="container-page py-14">
      <Link href={`/${locale}/blog`} className="text-sm text-ocean-700 hover:underline">
        ← {t.allStories}
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ backgroundColor: category.fields.color }}>
          <Icon name={category.fields.icon} className="h-7 w-7" />
        </span>
        <h1 className="font-display text-4xl text-ink md:text-5xl">{category.fields.name}</h1>
      </div>
      {category.fields.description && <p className="mt-4 max-w-2xl text-lg text-ink/70">{category.fields.description}</p>}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.sys.id} article={article} locale={locale} />
        ))}
      </div>
    </div>
  );
}

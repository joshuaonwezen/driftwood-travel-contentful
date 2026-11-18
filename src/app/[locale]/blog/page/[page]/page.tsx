import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ARTICLES_PER_PAGE, getAllArticleRefs } from "@/lib/contentful";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { BlogIndex } from "@/components/blog-index";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = Math.ceil((await getAllArticleRefs()).length / ARTICLES_PER_PAGE);
  return Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/page/[page]">): Promise<Metadata> {
  const { locale, page } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: `/blog/page/${page}`, title: `${t.journal} – ${t.page} ${page}`, description: t.journalIntro });
}

export default async function BlogPagedPage({ params }: PageProps<"/[locale]/blog/page/[page]">) {
  const { locale, page } = await params;
  if (!hasLocale(locale)) notFound();
  const n = Number(page);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) redirect(`/${locale}/blog`);
  return <BlogIndex locale={locale} page={n} />;
}

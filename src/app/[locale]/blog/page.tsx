import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { BlogIndex } from "@/components/blog-index";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/blog", title: t.journal, description: t.journalIntro });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <BlogIndex locale={locale} page={1} />;
}

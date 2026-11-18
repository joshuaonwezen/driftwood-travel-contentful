import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageByPath } from "@/lib/contentful";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { BlockRenderer } from "@/components/blocks/block-renderer";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const page = await getLandingPageByPath("/", locale);
  if (!page) return {};
  return pageMetadata({ locale, path: "", seo: page.fields.seo, title: page.fields.title });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const page = await getLandingPageByPath("/", locale);
  if (!page) notFound();
  return <BlockRenderer sections={page.fields.sections} locale={locale} />;
}

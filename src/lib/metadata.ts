import type { Metadata } from "next";
import type { Asset, Entry } from "contentful";
import type { TypeSeoSkeleton } from "@/types/contentful";
import { getSiteSettings } from "./contentful";
import { CONTENTFUL_LOCALE, LOCALES, type Locale } from "./i18n";

type Seo = Entry<TypeSeoSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>;

type Input = {
  locale: Locale;
  /** Path without locale prefix, "" for the homepage. */
  path: string;
  seo?: Seo;
  title: string;
  description?: string;
  image?: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string>;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Page metadata from an `seo` entry, falling back to page fields and then to Site settings → Default SEO. */
export async function pageMetadata({ locale, path, seo, title, description, image, type = "website", publishedTime }: Input): Promise<Metadata> {
  const settings = await getSiteSettings(locale);
  const defaults = settings?.fields.defaultSeo?.fields;
  const meta = seo?.fields;

  const finalDescription = meta?.metaDescription ?? description ?? defaults?.metaDescription;
  const ogImage = meta?.ogImage ?? image ?? defaults?.ogImage;
  const ogUrl = ogImage?.fields.file?.url;

  return {
    title: meta?.metaTitle ? { absolute: meta.metaTitle } : title,
    description: finalDescription,
    alternates: {
      canonical: meta?.canonicalUrl ?? `/${locale}${path}`,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [CONTENTFUL_LOCALE[l], `/${l}${path}`])), "x-default": `/en${path}` },
    },
    robots: meta?.noIndex || meta?.noFollow ? { index: !meta.noIndex, follow: !meta.noFollow } : undefined,
    openGraph: {
      type,
      title: meta?.metaTitle ?? title,
      description: finalDescription,
      locale: CONTENTFUL_LOCALE[locale].replace("-", "_"),
      siteName: settings?.fields.siteName,
      ...(ogUrl ? { images: [{ url: `https:${ogUrl}?w=1200&h=630&fit=fill&fm=jpg` }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
  };
}

import type { MetadataRoute } from "next";
import { getAllArticleRefs, getAllAuthors, getAllDestinationRefs, getCategories, getLandingPageIndex } from "@/lib/contentful";
import { CONTENTFUL_LOCALE, LOCALES } from "@/lib/i18n";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [pages, articles, destinations, authors, categories] = await Promise.all([
    getLandingPageIndex(),
    getAllArticleRefs(),
    getAllDestinationRefs(),
    getAllAuthors(),
    getCategories("en"),
  ]);

  const paths: { path: string; lastModified?: string }[] = [
    ...[...pages.values()].filter((p) => p.showInSitemap && p.path).map((p) => ({ path: p.path === "/" ? "" : p.path, lastModified: p.updatedAt })),
    { path: "/blog" },
    { path: "/destinations" },
    ...articles.map((a) => ({ path: `/blog/${a.fields.slug}`, lastModified: a.sys.updatedAt })),
    ...destinations.map((d) => ({ path: `/destinations/${d.fields.slug}`, lastModified: d.sys.updatedAt })),
    ...authors.map((a) => ({ path: `/authors/${a.fields.slug}`, lastModified: a.sys.updatedAt })),
    ...categories.map((c) => ({ path: `/blog/category/${c.fields.slug}`, lastModified: c.sys.updatedAt })),
  ];

  return paths.flatMap(({ path, lastModified }) =>
    LOCALES.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [CONTENTFUL_LOCALE[l], `${base}/${l}${path}`])) },
    })),
  );
}

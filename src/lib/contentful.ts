import { createClient, type ContentfulClientApi, type EntrySkeletonType, type EntriesQueries } from "contentful";
import { draftMode } from "next/headers";
import { cache } from "react";
import type {
  TypeArticle,
  TypeArticleSkeleton,
  TypeAuthor,
  TypeAuthorSkeleton,
  TypeCategory,
  TypeCategorySkeleton,
  TypeDestination,
  TypeDestinationSkeleton,
  TypeLandingPage,
  TypeLandingPageSkeleton,
  TypeSiteSettings,
  TypeSiteSettingsSkeleton,
} from "@/types/contentful";
import { CONTENTFUL_LOCALE, type Locale } from "./i18n";

/* ------------------------------------------------------------------ clients */

let delivery: ContentfulClientApi<undefined> | undefined;
let preview: ContentfulClientApi<undefined> | undefined;

function baseClient(isPreview: boolean) {
  const space = process.env.CONTENTFUL_SPACE_ID!;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
  if (isPreview) {
    preview ??= createClient({
      space,
      environment,
      accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
      host: "preview.contentful.com",
    });
    return preview;
  }
  delivery ??= createClient({ space, environment, accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN! });
  return delivery;
}

/** Draft mode switches every query to the Content Preview API (drafts + pending changes). */
export async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (generateStaticParams, sitemap at build time)
  }
}

async function client() {
  return baseClient(await isPreview()).withoutUnresolvableLinks;
}

/* -------------------------------------------------------------------- types */

type Mod = "WITHOUT_UNRESOLVABLE_LINKS";
export type LandingPage = TypeLandingPage<Mod, string>;
export type Article = TypeArticle<Mod, string>;
export type Destination = TypeDestination<Mod, string>;
export type Author = TypeAuthor<Mod, string>;
export type Category = TypeCategory<Mod, string>;
export type SiteSettings = TypeSiteSettings<Mod, string>;

/** Fetch every entry of a query, paging through the 1000-item limit. */
async function getAll<S extends EntrySkeletonType>(query: EntriesQueries<S, Mod>, isPreview = false) {
  const api = baseClient(isPreview).withoutUnresolvableLinks;
  const items = [];
  for (let skip = 0; ; skip += 1000) {
    const page = await api.getEntries<S>({ ...query, limit: 1000, skip });
    items.push(...page.items);
    if (skip + page.items.length >= page.total) return items;
  }
}

/* ----------------------------------------------------------- landing pages */

export type PageNode = { id: string; slug: string; parentId?: string; path: string; showInSitemap: boolean; updatedAt: string };

/**
 * Landing page URLs are not stored in Contentful: they are built from each page's
 * slug and its chain of parentPage references. The page with slug "home" is "/".
 */
export const getLandingPageIndex = cache(async (): Promise<Map<string, PageNode>> => {
  const api = baseClient(await isPreview());
  const { items } = await api.getEntries<TypeLandingPageSkeleton>({
    content_type: "landingPage",
    select: ["sys.id", "sys.updatedAt", "fields.slug", "fields.parentPage", "fields.showInSitemap"],
    include: 0,
    limit: 1000,
  });

  const raw = new Map(
    items.map((item) => [
      item.sys.id,
      {
        id: item.sys.id,
        slug: item.fields.slug as string,
        parentId: (item.fields.parentPage as { sys: { id: string } } | undefined)?.sys.id,
        showInSitemap: (item.fields.showInSitemap as boolean | undefined) ?? true,
        updatedAt: item.sys.updatedAt,
      },
    ]),
  );

  const pathOf = (id: string, seen = new Set<string>()): string => {
    const node = raw.get(id);
    if (!node || seen.has(id)) return "";
    if (node.slug === "home") return "/";
    seen.add(id);
    const parent = node.parentId ? pathOf(node.parentId, seen) : "";
    return `${parent === "/" ? "" : parent}/${node.slug}`;
  };

  return new Map([...raw.values()].map((node) => [node.id, { ...node, path: pathOf(node.id) }]));
});

export async function getLandingPageByPath(path: string, locale: Locale): Promise<LandingPage | undefined> {
  const index = await getLandingPageIndex();
  const node = [...index.values()].find((n) => n.path === path);
  if (!node) return undefined;
  const { items } = await (await client()).getEntries<TypeLandingPageSkeleton>({
    content_type: "landingPage",
    "sys.id": node.id,
    include: 10,
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items[0];
}

/* ----------------------------------------------------------------- settings */

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSettings | undefined> => {
  const { items } = await (await client()).getEntries<TypeSiteSettingsSkeleton>({
    content_type: "siteSettings",
    limit: 1,
    include: 4,
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items[0];
});

/* ------------------------------------------------------------------ articles */

export const ARTICLES_PER_PAGE = 12;

export async function getArticles(
  locale: Locale,
  opts: { limit?: number; skip?: number; categoryId?: string; authorId?: string; destinationId?: string; excludeId?: string } = {},
) {
  return (await client()).getEntries<TypeArticleSkeleton>({
    content_type: "article",
    order: ["-fields.publishDate"],
    limit: opts.limit ?? ARTICLES_PER_PAGE,
    skip: opts.skip ?? 0,
    include: 2,
    locale: CONTENTFUL_LOCALE[locale],
    ...(opts.categoryId ? { "fields.categories.sys.id": opts.categoryId } : {}),
    ...(opts.authorId ? { "fields.author.sys.id": opts.authorId } : {}),
    ...(opts.destinationId ? { "fields.destinations.sys.id": opts.destinationId } : {}),
    ...(opts.excludeId ? { "sys.id[ne]": opts.excludeId } : {}),
  });
}

export const getArticleBySlug = cache(async (slug: string, locale: Locale): Promise<Article | undefined> => {
  const { items } = await (await client()).getEntries<TypeArticleSkeleton>({
    content_type: "article",
    "fields.slug": slug,
    include: 3,
    limit: 1,
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items[0];
});

export async function getAllArticleRefs() {
  return getAll<TypeArticleSkeleton>({
    content_type: "article",
    select: ["sys.id", "sys.updatedAt", "fields.slug"],
  });
}

/* -------------------------------------------------------------- destinations */

export async function getDestinations(locale: Locale, opts: { featured?: boolean; limit?: number } = {}) {
  return (await client()).getEntries<TypeDestinationSkeleton>({
    content_type: "destination",
    order: ["fields.slug"],
    limit: opts.limit ?? 100,
    include: 1,
    locale: CONTENTFUL_LOCALE[locale],
    ...(opts.featured ? { "fields.featured": true } : {}),
  });
}

export const getDestinationBySlug = cache(async (slug: string, locale: Locale): Promise<Destination | undefined> => {
  const { items } = await (await client()).getEntries<TypeDestinationSkeleton>({
    content_type: "destination",
    "fields.slug": slug,
    include: 2,
    limit: 1,
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items[0];
});

export async function getAllDestinationRefs() {
  return getAll<TypeDestinationSkeleton>({
    content_type: "destination",
    select: ["sys.id", "sys.updatedAt", "fields.slug"],
  });
}

/* --------------------------------------------------------- authors, categories */

export const getAuthorBySlug = cache(async (slug: string, locale: Locale): Promise<Author | undefined> => {
  const { items } = await (await client()).getEntries<TypeAuthorSkeleton>({
    content_type: "author",
    "fields.slug": slug,
    limit: 1,
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items[0];
});

export async function getAllAuthors() {
  return getAll<TypeAuthorSkeleton>({ content_type: "author", select: ["sys.id", "sys.updatedAt", "fields.slug"] });
}

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
  const { items } = await (await client()).getEntries<TypeCategorySkeleton>({
    content_type: "category",
    order: ["fields.slug"],
    locale: CONTENTFUL_LOCALE[locale],
  });
  return items;
});

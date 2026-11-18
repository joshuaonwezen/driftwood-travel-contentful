import type { Entry, EntrySkeletonType } from "contentful";
import { getLandingPageIndex } from "./contentful";
import type { Locale } from "./i18n";

type Linkable = Pick<Entry<EntrySkeletonType, "WITHOUT_UNRESOLVABLE_LINKS", string>, "sys" | "fields">;

/** Public URL for a page-like entry (landingPage, article, destination, author, category). */
export async function hrefForEntry(entry: Linkable | undefined, locale: Locale): Promise<string | undefined> {
  if (!entry?.sys?.contentType) return undefined;
  const slug = (entry.fields as { slug?: string }).slug;
  switch (entry.sys.contentType.sys.id) {
    case "landingPage": {
      const node = (await getLandingPageIndex()).get(entry.sys.id);
      if (!node) return undefined;
      return node.path === "/" ? `/${locale}` : `/${locale}${node.path}`;
    }
    case "article":
      return `/${locale}/blog/${slug}`;
    case "destination":
      return `/${locale}/destinations/${slug}`;
    case "author":
      return `/${locale}/authors/${slug}`;
    case "category":
      return `/${locale}/blog/category/${slug}`;
    default:
      return undefined;
  }
}

/** Custom URLs from the CMS: site paths get the locale prefix, absolute URLs pass through. */
export function hrefForUrl(url: string | undefined, locale: Locale): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return `/${locale}${url === "/" ? "" : url}`;
  return url;
}

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

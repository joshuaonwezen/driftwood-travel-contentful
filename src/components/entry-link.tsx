import Link from "next/link";
import type { ReactNode } from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import { hrefForEntry, hrefForUrl, isExternal } from "@/lib/links";
import type { Locale } from "@/lib/i18n";

type Props = {
  entry?: Entry<EntrySkeletonType, "WITHOUT_UNRESOLVABLE_LINKS", string>;
  url?: string;
  locale: Locale;
  className?: string;
  newTab?: boolean;
  children: ReactNode;
};

/** Link to a CMS entry (resolved to its URL) or a custom URL. Renders plain text if neither resolves. */
export async function EntryLink({ entry, url, locale, className, newTab, children }: Props) {
  const href = (await hrefForEntry(entry, locale)) ?? hrefForUrl(url, locale);
  if (!href) return <span className={className}>{children}</span>;
  if (isExternal(href)) {
    return (
      <a href={href} className={className} {...(newTab || href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

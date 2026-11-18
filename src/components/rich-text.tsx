import Link from "next/link";
import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types";
import type { Entry, EntrySkeletonType, Asset } from "contentful";
import { ContentfulImage } from "./contentful-image";
import { EntryLink } from "./entry-link";
import { VideoEmbed } from "./blocks/video-embed";
import { CtaBanner } from "./blocks/cta-banner";
import { isTypeCtaBanner, isTypeVideoEmbed } from "@/types/contentful";
import { hrefForUrl, isExternal } from "@/lib/links";
import type { Locale } from "@/lib/i18n";

type AnyEntry = Entry<EntrySkeletonType, "WITHOUT_UNRESOLVABLE_LINKS", string>;

function options(locale: Locale): Options {
  return {
    renderMark: {
      [MARKS.CODE]: (text) => <code>{text}</code>,
    },
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = node.data.target as Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined;
        if (!asset?.fields) return null;
        return (
          <figure className="not-prose my-8">
            <ContentfulImage asset={asset} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full rounded-xl" />
            {asset.fields.title && <figcaption className="mt-2 text-sm text-ink/60">{asset.fields.title}</figcaption>}
          </figure>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entry = node.data.target as AnyEntry | undefined;
        if (!entry?.fields) return null;
        if (isTypeVideoEmbed<"WITHOUT_UNRESOLVABLE_LINKS", string>(entry)) return <VideoEmbed entry={entry} locale={locale} compact />;
        if (isTypeCtaBanner<"WITHOUT_UNRESOLVABLE_LINKS", string>(entry)) return <CtaBanner entry={entry} locale={locale} compact />;
        return null;
      },
      [INLINES.ENTRY_HYPERLINK]: (node, children) => (
        <EntryLink entry={node.data.target as AnyEntry} locale={locale}>
          {children}
        </EntryLink>
      ),
      [INLINES.HYPERLINK]: (node, children) => {
        const href = hrefForUrl(node.data.uri as string, locale)!;
        return isExternal(href) ? (
          <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        ) : (
          <Link href={href}>{children}</Link>
        );
      },
      [BLOCKS.TABLE]: (_node, children) => (
        <div className="not-prose my-6 overflow-x-auto">
          <table className="rt-table">
            <tbody>{children}</tbody>
          </table>
        </div>
      ),
    },
  };
}

export function RichText({ document, locale, className }: { document?: Document; locale: Locale; className?: string }) {
  if (!document) return null;
  return <div className={`richtext ${className ?? ""}`}>{documentToReactComponents(document, options(locale))}</div>;
}

/** Word count of a rich text document, for reading-time estimates. */
export function countWords(document?: Document): number {
  let words = 0;
  const walk = (node: unknown) => {
    const n = node as { nodeType?: string; value?: string; content?: unknown[] };
    if (n.nodeType === "text" && n.value) words += n.value.split(/\s+/).filter(Boolean).length;
    n.content?.forEach(walk);
  };
  if (document) walk(document);
  return words;
}

"use client";

/**
 * next/image loader that uses the Contentful Images API for resizing and format
 * conversion (https://www.contentful.com/developers/docs/references/images-api/).
 */
export default function contentfulImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src.startsWith("//") ? `https:${src}` : src);
  if (url.pathname.endsWith(".svg")) return url.toString();
  url.searchParams.set("w", String(Math.min(width, 2400)));
  url.searchParams.set("q", String(quality ?? 72));
  url.searchParams.set("fm", "webp");
  return url.toString();
}

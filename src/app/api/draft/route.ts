import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Entry point for Contentful "Open preview". Configure the content preview URL as
 *   https://<site>/api/draft?secret=<CONTENTFUL_PREVIEW_SECRET>&slug=/blog/{entry.fields.slug}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (!process.env.CONTENTFUL_PREVIEW_SECRET || secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  // Only same-site paths, to avoid an open redirect.
  if (!slug || !slug.startsWith("/") || slug.startsWith("//")) {
    return new Response("Invalid slug", { status: 400 });
  }

  (await draftMode()).enable();
  redirect(/^\/(en|nl)(\/|$)/.test(slug) ? slug : `/en${slug === "/" ? "" : slug}`);
}

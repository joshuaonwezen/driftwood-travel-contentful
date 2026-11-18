import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageByPath, getLandingPageIndex } from "@/lib/contentful";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { BlockRenderer } from "@/components/blocks/block-renderer";

export const revalidate = 3600;

/** Every landing page except the homepage, e.g. /about/team -> { slug: ["about", "team"] }. */
export async function generateStaticParams() {
  const index = await getLandingPageIndex();
  return [...index.values()].filter((n) => n.path !== "/" && n.path).map((n) => ({ slug: n.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const path = `/${slug.join("/")}`;
  const page = await getLandingPageByPath(path, locale);
  if (!page) return {};
  return pageMetadata({ locale, path, seo: page.fields.seo, title: page.fields.title });
}

export default async function LandingPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const page = await getLandingPageByPath(`/${slug.join("/")}`, locale);
  if (!page) notFound();

  const sections = page.fields.sections ?? [];
  const startsWithHero = sections[0]?.sys.contentType.sys.id === "heroBlock";
  return (
    <>
      {/* Pages without a hero (legal pages) get a plain title. */}
      {!startsWithHero && (
        <div className="container-page max-w-3xl pt-14">
          <h1 className="font-display text-4xl text-ink md:text-5xl">{page.fields.title}</h1>
        </div>
      )}
      <BlockRenderer sections={sections} locale={locale} />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES_PER_PAGE, getArticles, getCategories } from "@/lib/contentful";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ArticleCard } from "./cards";

/** Article listing shared by /blog and /blog/page/[page]. */
export async function BlogIndex({ locale, page }: { locale: Locale; page: number }) {
  const t = getDictionary(locale);
  const [{ items, total }, categories] = await Promise.all([
    getArticles(locale, { skip: (page - 1) * ARTICLES_PER_PAGE }),
    getCategories(locale),
  ]);
  if (!items.length) notFound();
  const pages = Math.ceil(total / ARTICLES_PER_PAGE);
  const pageHref = (n: number) => (n === 1 ? `/${locale}/blog` : `/${locale}/blog/page/${n}`);

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl text-ink md:text-5xl">{t.journal}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/70">{t.journalIntro}</p>

      <nav aria-label={t.categories} className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.sys.id} href={`/${locale}/blog/category/${c.fields.slug}`} className="rounded-full border border-sand-200 bg-white px-4 py-1.5 text-sm hover:border-ocean-600">
            {c.fields.name}
          </Link>
        ))}
      </nav>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.sys.id} article={article} locale={locale} />
        ))}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn btn-light border border-sand-200">
              {t.previous}
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              aria-current={n === page ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${n === page ? "bg-ink text-white" : "hover:bg-sand-100"}`}
            >
              {n}
            </Link>
          ))}
          {page < pages && (
            <Link href={pageHref(page + 1)} className="btn btn-light border border-sand-200">
              {t.next}
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

import { getDictionary, type Locale } from "@/lib/i18n";

export function PreviewBanner({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="bg-clay text-white">
      <form action="/api/disable-draft" method="post" className="container-page flex items-center justify-between gap-4 py-2 text-sm">
        <span>{t.previewMode}</span>
        <button type="submit" className="rounded border border-white/60 px-3 py-1 hover:bg-white/10">
          {t.exitPreview}
        </button>
      </form>
    </div>
  );
}

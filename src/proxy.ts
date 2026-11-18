import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/** Pick the first supported language from Accept-Language, by quality. */
function preferredLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return (ranked.find((r) => (LOCALES as readonly string[]).includes(r.lang))?.lang as Locale) ?? DEFAULT_LOCALE;
}

/** Every page lives under /en or /nl; unprefixed URLs are redirected to the visitor's language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const locale = preferredLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (sitemap.xml, robots.txt, favicon.ico).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

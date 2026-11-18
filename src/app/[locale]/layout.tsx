import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import { getSiteSettings, isPreview } from "@/lib/contentful";
import { hasLocale, LOCALES } from "@/lib/i18n";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PreviewBanner } from "@/components/layout/preview-banner";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const settings = await getSiteSettings(locale);
  const siteName = settings?.fields.siteName ?? "Driftwood Travel";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: settings?.fields.defaultSeo?.fields.metaTitle ?? siteName, template: `%s | ${siteName}` },
    description: settings?.fields.defaultSeo?.fields.metaDescription,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const [settings, preview] = await Promise.all([getSiteSettings(locale), isPreview()]);

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {preview && <PreviewBanner locale={locale} />}
        {settings?.fields.announcement && (
          <div className="bg-ocean-700 px-4 py-2 text-center text-sm text-white">{settings.fields.announcement}</div>
        )}
        <Header settings={settings} locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} locale={locale} />
      </body>
    </html>
  );
}

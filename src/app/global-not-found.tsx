import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Driftwood Travel",
};

/** 404 for URLs outside /[locale] (the root layout lives under app/[locale]). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-sand-50 font-sans text-ink">
        <div className="text-center">
          <p className="text-6xl">404</p>
          <p className="mt-4">
            Page not found. <Link href="/en" className="text-ocean-700 underline">Go to the homepage</Link>
          </p>
        </div>
      </body>
    </html>
  );
}

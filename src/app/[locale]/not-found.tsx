import Link from "next/link";

/** not-found.js receives no params, so the copy is shown in both languages. */
export default function NotFound() {
  return (
    <div className="container-page max-w-2xl py-24 text-center">
      <p className="font-display text-7xl text-ocean-600">404</p>
      <h1 className="mt-6 font-display text-3xl text-ink">Page not found · Pagina niet gevonden</h1>
      <p className="mt-4 text-ink/70">
        We couldn&apos;t find that page. It may have moved, or it never existed.
        <br />
        We konden deze pagina niet vinden. Misschien is hij verplaatst, of heeft hij nooit bestaan.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/en" className="btn btn-primary">
          Homepage (EN)
        </Link>
        <Link href="/nl" className="btn btn-light border border-sand-200">
          Homepage (NL)
        </Link>
      </div>
    </div>
  );
}

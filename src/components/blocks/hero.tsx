import type { TypeHeroBlock } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { ContentfulImage } from "../contentful-image";
import { EntryLink } from "../entry-link";

type Props = { entry: TypeHeroBlock<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale; priority?: boolean };

export function Hero({ entry, locale, priority }: Props) {
  const { headline, subheadline, backgroundImage, ctaLabel, ctaLink, variant = "centered", overlayOpacity = 35 } = entry.fields;

  const button =
    ctaLabel && ctaLink ? (
      <EntryLink entry={ctaLink} locale={locale} className="btn btn-primary mt-8">
        {ctaLabel}
      </EntryLink>
    ) : null;

  if (variant === "split") {
    return (
      <section className="bg-sand-100">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">{headline}</h1>
            {subheadline && <p className="mt-5 max-w-xl text-lg text-ink/75">{subheadline}</p>}
            {button}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <ContentfulImage asset={backgroundImage} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={priority} />
          </div>
        </div>
      </section>
    );
  }

  const tall = variant === "fullBleed";
  return (
    <section className={`relative isolate flex overflow-hidden ${tall ? "min-h-[72vh] items-end" : "min-h-[44vh] items-center"}`}>
      <ContentfulImage asset={backgroundImage} fill sizes="100vw" className="-z-20 object-cover" priority={priority} />
      <div className="absolute inset-0 -z-10 bg-ocean-900" style={{ opacity: overlayOpacity / 100 }} />
      <div className={`container-page py-16 text-white ${tall ? "md:py-24" : "text-center"}`}>
        <h1 className={`font-display text-4xl leading-tight drop-shadow md:text-6xl ${tall ? "max-w-3xl" : "mx-auto max-w-3xl"}`}>{headline}</h1>
        {subheadline && <p className={`mt-5 text-lg text-white/90 md:text-xl ${tall ? "max-w-2xl" : "mx-auto max-w-2xl"}`}>{subheadline}</p>}
        {button}
      </div>
    </section>
  );
}

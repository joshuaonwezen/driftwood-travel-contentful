import { Star } from "lucide-react";
import type { TypeTestimonialBlock } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { ContentfulImage } from "../contentful-image";

type Props = { entry: TypeTestimonialBlock<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function Testimonial({ entry }: Props) {
  const { quote, personName, personTitle, avatar, rating } = entry.fields;
  return (
    <section className="bg-sand-100">
      <figure className="container-page max-w-3xl py-16 text-center">
        {rating && (
          <div className="flex justify-center gap-1 text-clay" aria-label={`${rating} / 5`}>
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
            ))}
          </div>
        )}
        <blockquote className="mt-6 font-display text-2xl leading-snug text-ink md:text-3xl">“{quote}”</blockquote>
        <figcaption className="mt-8 flex items-center justify-center gap-4">
          {avatar && (
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <ContentfulImage asset={avatar} fill sizes="56px" className="object-cover" />
            </div>
          )}
          <div className="text-left">
            <div className="font-semibold text-ink">{personName}</div>
            {personTitle && <div className="text-sm text-ink/60">{personTitle}</div>}
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

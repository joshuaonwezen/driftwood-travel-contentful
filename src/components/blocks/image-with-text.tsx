import type { TypeImageWithText } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { ContentfulImage } from "../contentful-image";
import { RichText } from "../rich-text";

type Props = { entry: TypeImageWithText<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function ImageWithText({ entry, locale }: Props) {
  const { heading, body, image, imagePosition = "left", caption } = entry.fields;
  return (
    <section className="container-page grid items-center gap-10 py-14 md:grid-cols-2">
      <figure className={imagePosition === "right" ? "md:order-2" : ""}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <ContentfulImage asset={image} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        {caption && <figcaption className="mt-2 text-sm text-ink/60">{caption}</figcaption>}
      </figure>
      <div>
        {heading && <h2 className="section-title">{heading}</h2>}
        <RichText document={body} locale={locale} className="mt-4" />
      </div>
    </section>
  );
}

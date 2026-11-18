import type { TypeRichTextBlock } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { RichText } from "../rich-text";

type Props = { entry: TypeRichTextBlock<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function RichTextBlock({ entry, locale }: Props) {
  const wide = entry.fields.width === "wide";
  return (
    <section className={`container-page py-10 ${wide ? "max-w-4xl" : "max-w-3xl"}`}>
      <RichText document={entry.fields.body} locale={locale} />
    </section>
  );
}

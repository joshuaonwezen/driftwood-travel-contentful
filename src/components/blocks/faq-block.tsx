import { ChevronDown } from "lucide-react";
import type { TypeFaqBlock } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { RichText } from "../rich-text";

type Props = { entry: TypeFaqBlock<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function FaqBlock({ entry, locale }: Props) {
  const { heading, items } = entry.fields;
  return (
    <section className="container-page max-w-3xl py-14">
      {heading && <h2 className="section-title">{heading}</h2>}
      <div className="mt-8 divide-y divide-sand-200 border-y border-sand-200">
        {items.map((item) =>
          item ? (
            <details key={item.sys.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                {item.fields.question}
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <RichText document={item.fields.answer} locale={locale} className="mt-3 text-ink/80" />
            </details>
          ) : null,
        )}
      </div>
    </section>
  );
}

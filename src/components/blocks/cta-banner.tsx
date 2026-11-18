import type { TypeCtaBanner } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";
import { EntryLink } from "../entry-link";

const THEMES: Record<string, { box: string; button: string }> = {
  sand: { box: "bg-sand-200 text-ink", button: "btn-primary" },
  ocean: { box: "bg-ocean-700 text-white", button: "btn-light" },
  forest: { box: "bg-forest text-white", button: "btn-light" },
  dark: { box: "bg-ink text-white", button: "btn-light" },
};

type Props = { entry: TypeCtaBanner<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale; compact?: boolean };

export function CtaBanner({ entry, locale, compact }: Props) {
  const { heading, body, buttonLabel, buttonLink, buttonUrl, theme = "ocean" } = entry.fields;
  const t = THEMES[theme] ?? THEMES.ocean;

  const content = (
    <div className={`not-prose rounded-2xl ${t.box} ${compact ? "my-8 p-6" : "p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-12"}`}>
      <div>
        <h2 className={`font-display ${compact ? "text-2xl" : "text-3xl"}`}>{heading}</h2>
        {body && <p className="mt-3 max-w-2xl opacity-85">{body}</p>}
      </div>
      {buttonLabel && (buttonLink || buttonUrl) && (
        <EntryLink entry={buttonLink} url={buttonUrl} locale={locale} className={`btn ${t.button} mt-6 shrink-0 md:mt-0`}>
          {buttonLabel}
        </EntryLink>
      )}
    </div>
  );

  return compact ? content : <section className="container-page py-12">{content}</section>;
}

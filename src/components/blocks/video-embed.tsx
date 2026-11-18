import type { TypeVideoEmbed } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";

type Props = { entry: TypeVideoEmbed<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale; compact?: boolean };

export function VideoEmbed({ entry, compact }: Props) {
  const { title, provider, videoId, caption } = entry.fields;
  const src =
    provider === "vimeo"
      ? `https://player.vimeo.com/video/${videoId}`
      : `https://www.youtube-nocookie.com/embed/${videoId}`;

  const player = (
    <figure className="not-prose my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
        <iframe
          src={src}
          title={title ?? "Video"}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {(title || caption) && (
        <figcaption className="mt-2 text-sm text-ink/60">
          {title}
          {title && caption ? " · " : ""}
          {caption}
        </figcaption>
      )}
    </figure>
  );

  return compact ? player : <section className="container-page max-w-4xl py-8">{player}</section>;
}

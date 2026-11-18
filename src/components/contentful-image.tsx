import Image from "next/image";
import type { Asset } from "contentful";

type Props = {
  asset: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Fill the (relatively positioned) parent instead of using intrinsic dimensions. */
  fill?: boolean;
};

export function ContentfulImage({ asset, sizes, className, priority, fill }: Props) {
  const fields = asset?.fields;
  const file = fields?.file;
  if (!fields || !file?.url) return null;
  const alt = fields.description || fields.title || "";
  const src = file.url.startsWith("//") ? `https:${file.url}` : file.url;

  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} />;
  }
  const { width = 1600, height = 1000 } = file.details?.image ?? {};
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={className} priority={priority} />;
}

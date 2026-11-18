import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeDestinationSkeleton } from "./TypeDestination";
import type { TypeLandingPageSkeleton } from "./TypeLandingPage";

export interface TypeHeroBlockFields {
    internalName: EntryFieldTypes.Symbol;
    headline: EntryFieldTypes.Symbol;
    subheadline?: EntryFieldTypes.Text;
    backgroundImage?: EntryFieldTypes.AssetLink;
    ctaLabel?: EntryFieldTypes.Symbol;
    ctaLink?: EntryFieldTypes.EntryLink<TypeArticleSkeleton | TypeDestinationSkeleton | TypeLandingPageSkeleton>;
    variant?: EntryFieldTypes.Symbol<"centered" | "fullBleed" | "split">;
    overlayOpacity?: EntryFieldTypes.Integer;
}

export type TypeHeroBlockSkeleton = EntrySkeletonType<TypeHeroBlockFields, "heroBlock">;
export type TypeHeroBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeHeroBlockSkeleton, Modifiers, Locales>;

export function isTypeHeroBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeHeroBlock<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'heroBlock'
}

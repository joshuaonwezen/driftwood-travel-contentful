import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeDestinationSkeleton } from "./TypeDestination";
import type { TypeLandingPageSkeleton } from "./TypeLandingPage";

export interface TypeCtaBannerFields {
    internalName: EntryFieldTypes.Symbol;
    heading: EntryFieldTypes.Symbol;
    body?: EntryFieldTypes.Text;
    buttonLabel?: EntryFieldTypes.Symbol;
    buttonLink?: EntryFieldTypes.EntryLink<TypeArticleSkeleton | TypeDestinationSkeleton | TypeLandingPageSkeleton>;
    buttonUrl?: EntryFieldTypes.Symbol;
    theme?: EntryFieldTypes.Symbol<"dark" | "forest" | "ocean" | "sand">;
}

export type TypeCtaBannerSkeleton = EntrySkeletonType<TypeCtaBannerFields, "ctaBanner">;
export type TypeCtaBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeCtaBannerSkeleton, Modifiers, Locales>;

export function isTypeCtaBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeCtaBanner<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'ctaBanner'
}

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeDestinationSkeleton } from "./TypeDestination";
import type { TypeLandingPageSkeleton } from "./TypeLandingPage";

export interface TypeNavigationLinkFields {
    label: EntryFieldTypes.Symbol;
    internalLink?: EntryFieldTypes.EntryLink<TypeArticleSkeleton | TypeDestinationSkeleton | TypeLandingPageSkeleton>;
    url?: EntryFieldTypes.Symbol;
    openInNewTab?: EntryFieldTypes.Boolean;
    children?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavigationLinkSkeleton>>;
}

export type TypeNavigationLinkSkeleton = EntrySkeletonType<TypeNavigationLinkFields, "navigationLink">;
export type TypeNavigationLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationLinkSkeleton, Modifiers, Locales>;

export function isTypeNavigationLink<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeNavigationLink<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'navigationLink'
}

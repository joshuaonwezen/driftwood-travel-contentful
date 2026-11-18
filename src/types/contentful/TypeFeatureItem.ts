import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeDestinationSkeleton } from "./TypeDestination";
import type { TypeLandingPageSkeleton } from "./TypeLandingPage";

export interface TypeFeatureItemFields {
    title: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    icon?: EntryFieldTypes.Symbol<"camera" | "compass" | "heart" | "leaf" | "map" | "mountain" | "plane" | "shield" | "snowflake" | "star" | "sun" | "train" | "users" | "utensils" | "wallet">;
    link?: EntryFieldTypes.EntryLink<TypeArticleSkeleton | TypeDestinationSkeleton | TypeLandingPageSkeleton>;
}

export type TypeFeatureItemSkeleton = EntrySkeletonType<TypeFeatureItemFields, "featureItem">;
export type TypeFeatureItem<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFeatureItemSkeleton, Modifiers, Locales>;

export function isTypeFeatureItem<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeFeatureItem<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'featureItem'
}

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeArticleSkeleton } from "./TypeArticle";
import type { TypeCategorySkeleton } from "./TypeCategory";
import type { TypeDestinationSkeleton } from "./TypeDestination";

export interface TypeContentGridFields {
    internalName: EntryFieldTypes.Symbol;
    heading?: EntryFieldTypes.Symbol;
    mode: EntryFieldTypes.Symbol<"category" | "featuredDestinations" | "latestArticles" | "manual">;
    manualItems?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeArticleSkeleton | TypeDestinationSkeleton>>;
    category?: EntryFieldTypes.EntryLink<TypeCategorySkeleton>;
    limit?: EntryFieldTypes.Integer;
}

export type TypeContentGridSkeleton = EntrySkeletonType<TypeContentGridFields, "contentGrid">;
export type TypeContentGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeContentGridSkeleton, Modifiers, Locales>;

export function isTypeContentGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeContentGrid<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'contentGrid'
}

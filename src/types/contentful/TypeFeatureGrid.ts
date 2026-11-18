import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeFeatureItemSkeleton } from "./TypeFeatureItem";

export interface TypeFeatureGridFields {
    internalName: EntryFieldTypes.Symbol;
    heading?: EntryFieldTypes.Symbol;
    intro?: EntryFieldTypes.Text;
    columns?: EntryFieldTypes.Integer<2 | 3 | 4>;
    items: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFeatureItemSkeleton>>;
}

export type TypeFeatureGridSkeleton = EntrySkeletonType<TypeFeatureGridFields, "featureGrid">;
export type TypeFeatureGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFeatureGridSkeleton, Modifiers, Locales>;

export function isTypeFeatureGrid<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeFeatureGrid<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'featureGrid'
}

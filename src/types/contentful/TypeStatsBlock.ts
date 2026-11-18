import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeStatsBlockFields {
    internalName: EntryFieldTypes.Symbol;
    heading?: EntryFieldTypes.Symbol;
    stats: EntryFieldTypes.Object;
}

export type TypeStatsBlockSkeleton = EntrySkeletonType<TypeStatsBlockFields, "statsBlock">;
export type TypeStatsBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeStatsBlockSkeleton, Modifiers, Locales>;

export function isTypeStatsBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeStatsBlock<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'statsBlock'
}

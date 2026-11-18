import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeFaqItemSkeleton } from "./TypeFaqItem";

export interface TypeFaqBlockFields {
    internalName: EntryFieldTypes.Symbol;
    heading?: EntryFieldTypes.Symbol;
    items: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFaqItemSkeleton>>;
}

export type TypeFaqBlockSkeleton = EntrySkeletonType<TypeFaqBlockFields, "faqBlock">;
export type TypeFaqBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFaqBlockSkeleton, Modifiers, Locales>;

export function isTypeFaqBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeFaqBlock<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'faqBlock'
}

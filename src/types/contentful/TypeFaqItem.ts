import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeFaqItemFields {
    question: EntryFieldTypes.Symbol;
    answer: EntryFieldTypes.RichText;
}

export type TypeFaqItemSkeleton = EntrySkeletonType<TypeFaqItemFields, "faqItem">;
export type TypeFaqItem<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFaqItemSkeleton, Modifiers, Locales>;

export function isTypeFaqItem<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeFaqItem<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'faqItem'
}

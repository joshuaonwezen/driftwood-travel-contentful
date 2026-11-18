import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeRichTextBlockFields {
    internalName: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.RichText;
    width?: EntryFieldTypes.Symbol<"narrow" | "wide">;
}

export type TypeRichTextBlockSkeleton = EntrySkeletonType<TypeRichTextBlockFields, "richTextBlock">;
export type TypeRichTextBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRichTextBlockSkeleton, Modifiers, Locales>;

export function isTypeRichTextBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeRichTextBlock<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'richTextBlock'
}

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeImageWithTextFields {
    internalName: EntryFieldTypes.Symbol;
    heading?: EntryFieldTypes.Symbol;
    body?: EntryFieldTypes.RichText;
    image: EntryFieldTypes.AssetLink;
    imagePosition?: EntryFieldTypes.Symbol<"left" | "right">;
    caption?: EntryFieldTypes.Symbol;
}

export type TypeImageWithTextSkeleton = EntrySkeletonType<TypeImageWithTextFields, "imageWithText">;
export type TypeImageWithText<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeImageWithTextSkeleton, Modifiers, Locales>;

export function isTypeImageWithText<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeImageWithText<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'imageWithText'
}

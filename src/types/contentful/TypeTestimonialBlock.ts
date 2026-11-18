import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeTestimonialBlockFields {
    internalName: EntryFieldTypes.Symbol;
    quote: EntryFieldTypes.Text;
    personName: EntryFieldTypes.Symbol;
    personTitle?: EntryFieldTypes.Symbol;
    avatar?: EntryFieldTypes.AssetLink;
    rating?: EntryFieldTypes.Integer;
}

export type TypeTestimonialBlockSkeleton = EntrySkeletonType<TypeTestimonialBlockFields, "testimonialBlock">;
export type TypeTestimonialBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTestimonialBlockSkeleton, Modifiers, Locales>;

export function isTypeTestimonialBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeTestimonialBlock<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'testimonialBlock'
}

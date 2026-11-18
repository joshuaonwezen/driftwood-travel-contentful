import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeSeoFields {
    internalName: EntryFieldTypes.Symbol;
    metaTitle?: EntryFieldTypes.Symbol;
    metaDescription?: EntryFieldTypes.Text;
    ogImage?: EntryFieldTypes.AssetLink;
    noIndex?: EntryFieldTypes.Boolean;
    noFollow?: EntryFieldTypes.Boolean;
    canonicalUrl?: EntryFieldTypes.Symbol;
}

export type TypeSeoSkeleton = EntrySkeletonType<TypeSeoFields, "seo">;
export type TypeSeo<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSeoSkeleton, Modifiers, Locales>;

export function isTypeSeo<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeSeo<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'seo'
}

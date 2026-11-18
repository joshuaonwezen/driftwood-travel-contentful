import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAuthorFields {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    role?: EntryFieldTypes.Symbol;
    bio?: EntryFieldTypes.Text;
    avatar?: EntryFieldTypes.AssetLink;
    email?: EntryFieldTypes.Symbol;
    socialLinks?: EntryFieldTypes.Object;
    isStaff?: EntryFieldTypes.Boolean;
}

export type TypeAuthorSkeleton = EntrySkeletonType<TypeAuthorFields, "author">;
export type TypeAuthor<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAuthorSkeleton, Modifiers, Locales>;

export function isTypeAuthor<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeAuthor<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'author'
}

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeRedirectFields {
    fromPath: EntryFieldTypes.Symbol;
    toPath: EntryFieldTypes.Symbol;
    permanent?: EntryFieldTypes.Boolean;
}

export type TypeRedirectSkeleton = EntrySkeletonType<TypeRedirectFields, "redirect">;
export type TypeRedirect<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRedirectSkeleton, Modifiers, Locales>;

export function isTypeRedirect<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeRedirect<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'redirect'
}

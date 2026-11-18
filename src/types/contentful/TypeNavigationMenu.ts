import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNavigationLinkSkeleton } from "./TypeNavigationLink";

export interface TypeNavigationMenuFields {
    internalName: EntryFieldTypes.Symbol;
    items?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavigationLinkSkeleton>>;
}

export type TypeNavigationMenuSkeleton = EntrySkeletonType<TypeNavigationMenuFields, "navigationMenu">;
export type TypeNavigationMenu<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationMenuSkeleton, Modifiers, Locales>;

export function isTypeNavigationMenu<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeNavigationMenu<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'navigationMenu'
}

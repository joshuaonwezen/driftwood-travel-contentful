import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeLandingPageSkeleton } from "./TypeLandingPage";
import type { TypeNavigationMenuSkeleton } from "./TypeNavigationMenu";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypeSiteSettingsFields {
    internalName: EntryFieldTypes.Symbol;
    siteName: EntryFieldTypes.Symbol;
    logo?: EntryFieldTypes.AssetLink;
    homePage: EntryFieldTypes.EntryLink<TypeLandingPageSkeleton>;
    mainNavigation?: EntryFieldTypes.EntryLink<TypeNavigationMenuSkeleton>;
    footerNavigation?: EntryFieldTypes.EntryLink<TypeNavigationMenuSkeleton>;
    footerText?: EntryFieldTypes.Text;
    announcement?: EntryFieldTypes.Symbol;
    defaultSeo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
    socialLinks?: EntryFieldTypes.Object;
}

export type TypeSiteSettingsSkeleton = EntrySkeletonType<TypeSiteSettingsFields, "siteSettings">;
export type TypeSiteSettings<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSiteSettingsSkeleton, Modifiers, Locales>;

export function isTypeSiteSettings<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeSiteSettings<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'siteSettings'
}

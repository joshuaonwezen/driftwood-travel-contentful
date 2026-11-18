import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypeDestinationFields {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    tagline?: EntryFieldTypes.Symbol;
    summary?: EntryFieldTypes.Text;
    heroImage: EntryFieldTypes.AssetLink;
    gallery?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    country: EntryFieldTypes.Symbol;
    region: EntryFieldTypes.Symbol<"Africa" | "Asia" | "Europe" | "Middle East" | "North America" | "Oceania" | "South America">;
    location: EntryFieldTypes.Location;
    priceFrom?: EntryFieldTypes.Number;
    currency?: EntryFieldTypes.Symbol<"EUR" | "GBP" | "USD">;
    tripLengthDays?: EntryFieldTypes.Integer;
    bestMonths?: EntryFieldTypes.Array<EntryFieldTypes.Symbol<"apr" | "aug" | "dec" | "feb" | "jan" | "jul" | "jun" | "mar" | "may" | "nov" | "oct" | "sep">>;
    rating?: EntryFieldTypes.Number;
    highlights?: EntryFieldTypes.Object;
    travelTips?: EntryFieldTypes.Text;
    description?: EntryFieldTypes.RichText;
    featured?: EntryFieldTypes.Boolean;
    seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
}

export type TypeDestinationSkeleton = EntrySkeletonType<TypeDestinationFields, "destination">;
export type TypeDestination<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeDestinationSkeleton, Modifiers, Locales>;

export function isTypeDestination<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeDestination<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'destination'
}

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeVideoEmbedFields {
    internalName: EntryFieldTypes.Symbol;
    title?: EntryFieldTypes.Symbol;
    provider: EntryFieldTypes.Symbol<"vimeo" | "youtube">;
    videoId: EntryFieldTypes.Symbol;
    caption?: EntryFieldTypes.Symbol;
}

export type TypeVideoEmbedSkeleton = EntrySkeletonType<TypeVideoEmbedFields, "videoEmbed">;
export type TypeVideoEmbed<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVideoEmbedSkeleton, Modifiers, Locales>;

export function isTypeVideoEmbed<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeVideoEmbed<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'videoEmbed'
}

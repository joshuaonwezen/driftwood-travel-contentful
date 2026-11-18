import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeContentGridSkeleton } from "./TypeContentGrid";
import type { TypeCtaBannerSkeleton } from "./TypeCtaBanner";
import type { TypeFaqBlockSkeleton } from "./TypeFaqBlock";
import type { TypeFeatureGridSkeleton } from "./TypeFeatureGrid";
import type { TypeHeroBlockSkeleton } from "./TypeHeroBlock";
import type { TypeImageWithTextSkeleton } from "./TypeImageWithText";
import type { TypeRichTextBlockSkeleton } from "./TypeRichTextBlock";
import type { TypeSeoSkeleton } from "./TypeSeo";
import type { TypeStatsBlockSkeleton } from "./TypeStatsBlock";
import type { TypeTestimonialBlockSkeleton } from "./TypeTestimonialBlock";
import type { TypeVideoEmbedSkeleton } from "./TypeVideoEmbed";

export interface TypeLandingPageFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    parentPage?: EntryFieldTypes.EntryLink<TypeLandingPageSkeleton>;
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeContentGridSkeleton | TypeCtaBannerSkeleton | TypeFaqBlockSkeleton | TypeFeatureGridSkeleton | TypeHeroBlockSkeleton | TypeImageWithTextSkeleton | TypeRichTextBlockSkeleton | TypeStatsBlockSkeleton | TypeTestimonialBlockSkeleton | TypeVideoEmbedSkeleton>>;
    seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
    showInSitemap?: EntryFieldTypes.Boolean;
}

export type TypeLandingPageSkeleton = EntrySkeletonType<TypeLandingPageFields, "landingPage">;
export type TypeLandingPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLandingPageSkeleton, Modifiers, Locales>;

export function isTypeLandingPage<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeLandingPage<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'landingPage'
}

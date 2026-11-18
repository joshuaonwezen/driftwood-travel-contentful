import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAuthorSkeleton } from "./TypeAuthor";
import type { TypeCategorySkeleton } from "./TypeCategory";
import type { TypeDestinationSkeleton } from "./TypeDestination";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypeArticleFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    excerpt?: EntryFieldTypes.Text;
    heroImage: EntryFieldTypes.AssetLink;
    body: EntryFieldTypes.RichText;
    author: EntryFieldTypes.EntryLink<TypeAuthorSkeleton>;
    categories?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCategorySkeleton>>;
    destinations?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeDestinationSkeleton>>;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    publishDate: EntryFieldTypes.Date;
    readingTimeMinutes?: EntryFieldTypes.Integer;
    featured?: EntryFieldTypes.Boolean;
    relatedArticles?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeArticleSkeleton>>;
    seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
}

export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, "article">;
export type TypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleSkeleton, Modifiers, Locales>;

export function isTypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeArticle<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'article'
}

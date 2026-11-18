import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeMigrationLogFields {
    name: EntryFieldTypes.Symbol;
    applied?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypeMigrationLogSkeleton = EntrySkeletonType<TypeMigrationLogFields, "migrationLog">;
export type TypeMigrationLog<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeMigrationLogSkeleton, Modifiers, Locales>;

export function isTypeMigrationLog<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: unknown): entry is TypeMigrationLog<Modifiers, Locales> {
    const candidate = entry as { sys?: { contentType?: { sys?: { id?: string } } } };
    return candidate.sys?.contentType?.sys?.id === 'migrationLog'
}

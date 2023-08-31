// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export type Id = string;

/** Represents the table public.kysely_migration_lock */
export default interface KyselyMigrationLockTable {
  id: ColumnType<Id, Id, Id | null>;

  is_locked: ColumnType<number, number | null, number | null>;
}

export type KyselyMigrationLock = Selectable<KyselyMigrationLockTable>;

export type NewKyselyMigrationLock = Insertable<KyselyMigrationLockTable>;

export type KyselyMigrationLockUpdate = Updateable<KyselyMigrationLockTable>;

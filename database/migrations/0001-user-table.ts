import {Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('email', 'varchar', (col) => col.notNull().unique())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('password', 'varchar', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute()

    await db.schema
        .createIndex('user_email_index')
        .on('user')
        .column('email')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user').execute()
}
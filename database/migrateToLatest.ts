import * as path from 'path'
import {promises as fs} from 'fs'
import {FileMigrationProvider, Kysely, Migrator, PostgresDialect,} from 'kysely'
import {Pool} from "pg";
import dotenv from "dotenv";
import Database from "@/database/models/Database";

async function migrateToLatest() {
    if (process.env.NODE_ENV === 'development') {
        dotenv.config({path: path.resolve(process.cwd(), '.env.development.local')})
    }

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.POSTGRES_URL + "?sslmode=require"
            }),
        }),
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, './migrations'),
        }),
    })


    const {error, results} = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

migrateToLatest()
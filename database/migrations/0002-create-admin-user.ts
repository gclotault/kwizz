import {Kysely} from 'kysely'
import {randomBytes, scrypt as _scrypt} from "crypto";
import {promisify} from "util";

const scrypt = promisify(_scrypt);

export async function up(db: Kysely<any>): Promise<void> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt('KwizzAdmin', salt, 32)) as Buffer;
    const adminPassword = salt + '.' + hash.toString('hex');

    await db.insertInto('user')
        .values({email: 'admin@kwizz.com', name: 'admin', password: adminPassword})
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.deleteFrom('user').where('email', '=', 'admin@kwizz.com').execute()
}
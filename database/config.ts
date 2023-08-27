import {createKysely} from "@vercel/postgres-kysely";

export interface Database {
}

export const db = createKysely<Database>();
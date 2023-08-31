import {createKysely} from "@vercel/postgres-kysely";
import Database from "@/database/models/Database";

export const db = createKysely<Database>();
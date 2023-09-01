import {NeonDialect} from "kysely-neon";
import {Kysely} from "kysely";
import {neonConfig} from "@neondatabase/serverless";
import Database from "@/database/models/Database";

// if we're running locally
if (process.env.NODE_ENV !== "production") {
    // Set the WebSocket proxy to work with the local instance
    neonConfig.wsProxy = (host) => `${host}:5433/v1`;
    // Disable all authentication and encryption
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
}

if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
}

export const db = new Kysely<Database>({
    dialect: new NeonDialect({
        connectionString: process.env.POSTGRES_URL,
    }),
});
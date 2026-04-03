import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
    pool: mysql.Pool;
    db: ReturnType<typeof drizzle>;
};

const poolConnection = globalForDb.pool || mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'lakemba_mobile_king',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = globalForDb.db || drizzle(poolConnection, { schema, mode: "default" });

if (process.env.NODE_ENV !== 'production') {
    globalForDb.pool = poolConnection;
    globalForDb.db = db;
}

import { db } from './src/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        await db.execute(sql`TRUNCATE TABLE customers`);
        console.log("Truncated customers");
    } catch (e) {
        console.log("Error:", e);
    }
    process.exit(0);
}
run();

import { db } from './src/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

async function patch() {
    console.log('Patching bookings table...');
    try {
        await db.execute(sql`
            ALTER TABLE bookings 
            ADD COLUMN est_delivery_date VARCHAR(50),
            ADD COLUMN est_delivery_time VARCHAR(50),
            ADD COLUMN completion_date VARCHAR(50),
            ADD COLUMN completion_time VARCHAR(50),
            ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        console.log('Successfully patched bookings table!');
    } catch (e: any) {
        if (e.message.includes('Duplicate column name')) {
            console.log('Columns already exist.');
        } else {
            console.log('Error patching bookings:', e);
        }
    }
    process.exit(0);
}

patch();

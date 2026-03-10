import { repairQuotes } from './src/db/schema';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    console.log('Starting migration of repair quotes...');

    try {
        const { db } = await import('./src/db');

        // 1. Manually create the repair_quotes table
        console.log('Creating repair_quotes table if not exists...');
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS repair_quotes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100) NOT NULL,
                model VARCHAR(100) NOT NULL,
                issue VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                time VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table created or already exists.');

        // 2. Read the JSON file
        const filePath = path.join(process.cwd(), 'src', 'data', 'repairs.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        console.log(`Found ${data.length} quotes to migrate.`);

        // 3. Clear existing table (optional, for safety if run twice)
        await db.execute(sql`TRUNCATE TABLE repair_quotes`);

        // 4. Clean up price strings to decimal and insert
        const mappedData = data.map((item: any) => ({
            brand: item.brand,
            model: item.model,
            issue: item.issue,
            price: parseFloat(String(item.price).replace(/[^0-9.]/g, '') || '0').toFixed(2),
            time: item.time
        }));

        // Batch insert to avoid huge single statements
        const batchSize = 100;
        for (let i = 0; i < mappedData.length; i += batchSize) {
            const batch = mappedData.slice(i, i + batchSize);
            await db.insert(repairQuotes).values(batch);
            console.log(`Migrated batch ${i / batchSize + 1} (${batch.length} items)...`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }

    process.exit(0);
}

migrate();

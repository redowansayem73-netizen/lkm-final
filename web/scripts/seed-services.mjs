import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'services.json'), 'utf-8'));

// Exclude phone-screen-repair and apple-watch-repair (have hardcoded layouts)
const toSeed = servicesData.filter(s =>
    s.slug !== 'phone-screen-repair' && s.slug !== 'apple-watch-repair'
);

async function main() {
    const conn = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    console.log(`Seeding ${toSeed.length} services into the database...\n`);

    for (const svc of toSeed) {
        // Check if slug already exists
        const [existing] = await conn.execute('SELECT id FROM services WHERE slug = ?', [svc.slug]);
        if (existing.length > 0) {
            console.log(`  ⏩ Skipping "${svc.title}" — already exists`);
            continue;
        }

        await conn.execute(
            `INSERT INTO services (title, slug, icon, hero_description, content, is_active, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
            [
                svc.title,
                svc.slug,
                svc.icon || null,
                svc.description || null,
                svc.details ? `<p>${svc.details}</p>` : null,
            ]
        );
        console.log(`  ✅ Inserted "${svc.title}" (/${svc.slug})`);
    }

    console.log('\nDone! All services seeded.');
    await conn.end();
}

main().catch(err => { console.error(err); process.exit(1); });

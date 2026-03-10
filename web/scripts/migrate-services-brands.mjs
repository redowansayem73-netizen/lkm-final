import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'lakemba_mobile_king',
    });

    console.log('Connected to database. Running migrations...\n');

    // 1. Create services table
    console.log('1. Creating services table...');
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            icon VARCHAR(100),
            hero_description TEXT,
            hero_image VARCHAR(512),
            content TEXT,
            turnaround_time VARCHAR(255),
            models_list TEXT,
            faq_data TEXT,
            meta_title VARCHAR(255),
            meta_description TEXT,
            focus_keyword VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('   ✅ services table created.\n');

    // 2. Add new columns to brands table (safe - uses IF NOT EXISTS approach via try/catch)
    const brandsColumns = [
        { name: 'hero_title', type: 'VARCHAR(255)' },
        { name: 'hero_description', type: 'TEXT' },
        { name: 'hero_image', type: 'VARCHAR(512)' },
        { name: 'content', type: 'TEXT' },
        { name: 'turnaround_time', type: 'VARCHAR(255)' },
        { name: 'models_list', type: 'TEXT' },
        { name: 'faq_data', type: 'TEXT' },
        { name: 'meta_title', type: 'VARCHAR(255)' },
        { name: 'meta_description', type: 'TEXT' },
        { name: 'focus_keyword', type: 'VARCHAR(100)' },
    ];

    console.log('2. Adding new columns to brands table...');
    for (const col of brandsColumns) {
        try {
            await connection.execute(`ALTER TABLE brands ADD COLUMN ${col.name} ${col.type}`);
            console.log(`   ✅ Added ${col.name}`);
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log(`   ⏭️  ${col.name} already exists, skipping.`);
            } else {
                throw e;
            }
        }
    }

    console.log('\n✅ All migrations completed successfully!');
    await connection.end();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});

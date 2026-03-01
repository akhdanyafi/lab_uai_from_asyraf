import { db } from './db/index';
import { sql } from 'drizzle-orm';

async function fixHero() {
    console.log('Running raw SQL to fix hero_photos table...');
    try {
        await db.execute(sql.raw("ALTER TABLE hero_photos ADD COLUMN focal_x int DEFAULT 50 NOT NULL"));
        console.log('Successfully added focal_x');
    } catch (e: any) {
        console.log('Failed to add focal_x (might exist):', e.message);
    }

    try {
        await db.execute(sql.raw("ALTER TABLE hero_photos ADD COLUMN focal_y int DEFAULT 50 NOT NULL"));
        console.log('Successfully added focal_y');
    } catch (e: any) {
        console.log('Failed to add focal_y (might exist):', e.message);
    }

    // Check if the columns exist now
    try {
        const rows = await db.execute(sql.raw("DESCRIBE hero_photos"));
        console.log('hero_photos schema:', rows[0]);
    } catch (e: any) {
        console.log('Failed to describe table:', e.message);
    }

    process.exit(0);
}

fixHero();

import { db } from '../db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Starting manual migration for cover_path...');

    try {
        // Add 'cover_path' column
        console.log('Adding cover_path column...');
        await db.execute(sql`
            ALTER TABLE governance_docs 
            ADD COLUMN cover_path VARCHAR(255) NULL AFTER file_path;
        `);
        console.log('cover_path column added.');
    } catch (error: any) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('cover_path column already exists.');
        } else {
            console.error('Error adding cover_path column:', error);
        }
    }

    console.log('Migration completed.');
    process.exit(0);
}

main();

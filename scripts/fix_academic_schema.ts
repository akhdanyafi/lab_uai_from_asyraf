import { db } from '../db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Starting manual migration...');

    try {
        // 1. Add 'subject' column
        console.log('Adding subject column...');
        await db.execute(sql`
            ALTER TABLE academic_docs 
            ADD COLUMN subject VARCHAR(255) NULL AFTER title;
        `);
        console.log('Subject column added.');
    } catch (error: any) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Subject column already exists.');
        } else {
            console.error('Error adding subject column:', error);
        }
    }

    try {
        // 2. Update 'type' enum
        console.log('Updating type enum...');
        await db.execute(sql`
            ALTER TABLE academic_docs 
            MODIFY COLUMN type ENUM('Modul Praktikum', 'Laporan Praktikum', 'Jurnal Publikasi') NOT NULL;
        `);
        console.log('Type enum updated.');
    } catch (error) {
        console.error('Error updating type enum:', error);
    }

    console.log('Migration completed.');
    process.exit(0);
}

main();

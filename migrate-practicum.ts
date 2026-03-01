const { db } = require('./db');
const { sql } = require('drizzle-orm');

async function migrate() {
    console.log('Starting practicum schema migration...');

    try {
        await db.execute(sql.raw("ALTER TABLE courses MODIFY COLUMN semester ENUM('Ganjil', 'Genap') NULL"));
        console.log('1. courses.semester updated to enum');
    } catch (e: any) {
        console.log('1. courses.semester:', e.message);
    }

    try {
        await db.execute(sql.raw('ALTER TABLE scheduled_practicums DROP INDEX sp_semester_idx'));
        console.log('2. sp_semester_idx index dropped');
    } catch (e: any) {
        console.log('2. Index:', e.message);
    }

    try {
        await db.execute(sql.raw('ALTER TABLE scheduled_practicums DROP COLUMN semester'));
        console.log('3. semester column dropped from scheduled_practicums');
    } catch (e: any) {
        console.log('3. Column:', e.message);
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrate();

import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function updateLabAttendanceTable() {
    console.log('Updating lab_attendance table...');

    // First, clear existing data (since we need to add NOT NULL columns with FK)
    console.log('Clearing existing attendance data...');
    await db.execute(sql`DELETE FROM lab_attendance`);

    // Add room_id and purpose columns
    try {
        await db.execute(sql`
            ALTER TABLE lab_attendance 
            ADD COLUMN room_id INT NOT NULL AFTER user_id,
            ADD COLUMN purpose VARCHAR(255) NOT NULL AFTER room_id,
            ADD INDEX room_idx (room_id),
            ADD FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        `);
        console.log('Columns added successfully!');
    } catch (error: unknown) {
        const err = error as { code?: string };
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist, skipping...');
        } else {
            throw error;
        }
    }

    console.log('Table lab_attendance updated successfully!');
    process.exit(0);
}

updateLabAttendanceTable().catch((err) => {
    console.error('Error updating table:', err);
    process.exit(1);
});

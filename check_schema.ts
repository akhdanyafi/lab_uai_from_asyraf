
import { db } from './db';
import { sql } from 'drizzle-orm';

async function checkSchema() {
    try {
        const result = await db.execute(sql`DESCRIBE publications`);
        console.log(JSON.stringify(result[0], null, 2));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

checkSchema();

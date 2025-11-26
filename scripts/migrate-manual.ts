import { db } from "../db";
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("Applying migration...");

    const migrationFile = fs.readdirSync('./drizzle').find(f => f.endsWith('.sql'));
    if (!migrationFile) {
        console.error("No migration file found");
        process.exit(1);
    }

    const sql = fs.readFileSync(path.join('./drizzle', migrationFile), 'utf8');
    // Fix MySQL syntax issues from Drizzle generated SQL
    // Replace 'serial AUTO_INCREMENT' with 'int AUTO_INCREMENT' to avoid duplication
    const fixedSql = sql.replace(/serial AUTO_INCREMENT/g, 'int AUTO_INCREMENT');
    const statements = fixedSql.split(';').filter(s => s.trim() !== '');

    for (const statement of statements) {
        try {
            // Skip empty statements
            if (!statement.trim()) continue;

            // Clean up statement
            const cleanStatement = statement.replace(/--> statement-breakpoint/g, '').trim();
            if (!cleanStatement) continue;

            console.log(`Executing statement: ${cleanStatement.substring(0, 50)}...`);
            await db.execute(cleanStatement);
        } catch (err: any) {
            // Ignore table already exists errors
            const code = err.code || err.cause?.code;
            if (code !== 'ER_TABLE_EXISTS_ERROR') {
                console.error(`Failed to execute statement: ${statement}`);
                console.error(err);
            } else {
                console.log("Table already exists, skipping.");
            }
        }
    }

    console.log("Migration applied!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

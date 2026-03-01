const { db } = require('./db');
const { sql } = require('drizzle-orm');

async function migrate() {
    console.log('Starting migration for hero focal points and governance docs...');

    try {
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS \`governance_docs\` (
              \`id\` int AUTO_INCREMENT NOT NULL,
              \`admin_id\` int NOT NULL,
              \`title\` varchar(255) NOT NULL,
              \`file_path\` varchar(255) NOT NULL,
              \`cover_path\` varchar(255),
              \`type\` enum('SOP','LPJ Bulanan') NOT NULL,
              \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT \`governance_docs_id\` PRIMARY KEY(\`id\`)
            );
        `));
        console.log('1. Created governance_docs table (if not exists)');
    } catch (e) {
        console.log('1. Governance docs error:', e.message);
    }

    try {
        await db.execute(sql.raw(`
            ALTER TABLE \`governance_docs\` ADD CONSTRAINT \`governance_docs_admin_id_users_id_fk\` FOREIGN KEY (\`admin_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE no action;
        `));
        console.log('   Added foreign key constraint for governance_docs');
    } catch (e) {
        console.log('   Foreign key error (might already exist):', e.message);
    }

    try {
        await db.execute(sql.raw(`
            CREATE INDEX \`admin_idx\` ON \`governance_docs\` (\`admin_id\`);
        `));
        console.log('   Added index for governance_docs');
    } catch (e) {
        console.log('   Index error (might already exist):', e.message);
    }

    try {
        await db.execute(sql.raw("ALTER TABLE hero_photos ADD COLUMN focal_x int DEFAULT 50 NOT NULL"));
        console.log('2. hero_photos focal_x added');
    } catch (e) {
        console.log('2. hero_photos focal_x:', e.message);
    }

    try {
        await db.execute(sql.raw("ALTER TABLE hero_photos ADD COLUMN focal_y int DEFAULT 50 NOT NULL"));
        console.log('3. hero_photos focal_y added');
    } catch (e) {
        console.log('3. hero_photos focal_y:', e.message);
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrate();

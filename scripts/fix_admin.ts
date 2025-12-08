import { db } from '../db';
import { users, roles } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { sql } from 'drizzle-orm';

async function main() {
    console.log('Fixing admin account...');
    console.log('DB Config:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    // List tables
    const tables = await db.execute(sql`SHOW TABLES`);
    console.log('Tables in DB:', tables[0]);

    // 1. Find the admin role
    let adminRole = await db.select().from(roles).where(eq(roles.name, 'Admin')).limit(1);

    if (adminRole.length === 0) {
        console.log('Roles not found. Seeding roles...');
        await db.insert(roles).values([
            { name: 'Admin' },
            { name: 'Mahasiswa' },
            { name: 'Dosen' },
        ]);
        adminRole = await db.select().from(roles).where(eq(roles.name, 'Admin')).limit(1);
    }

    if (adminRole.length === 0) {
        console.error('Failed to create Admin role!');
        process.exit(1);
    }
    const adminRoleId = adminRole[0].id;

    // 2. Find the admin user (assuming email is 'admin@uai.ac.id' or similar, or just get the first user with admin role)
    // Let's try to find by role first
    const adminUsers = await db.select().from(users).where(eq(users.roleId, adminRoleId));

    if (adminUsers.length === 0) {
        console.log('No admin user found. Creating one...');
        const passwordHash = await bcrypt.hash('admin', 10);
        await db.insert(users).values({
            fullName: 'Administrator',
            identifier: '1',
            email: 'admin@uai.ac.id',
            passwordHash: passwordHash,
            roleId: adminRoleId,
            status: 'Active',
        });
        console.log('Admin user created: email=admin@uai.ac.id, password=admin');
    } else {
        console.log(`Found ${adminUsers.length} admin user(s). Updating passwords and status...`);
        const passwordHash = await bcrypt.hash('admin', 10);

        for (const user of adminUsers) {
            await db.update(users)
                .set({
                    passwordHash: passwordHash,
                    status: 'Active'
                })
                .where(eq(users.id, user.id));
            console.log(`Updated user ${user.email} (ID: ${user.id})`);
        }
        console.log('All admin users updated. Password set to: admin');
    }

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

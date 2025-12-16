
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    try {
        const allUsers = await db.select({
            id: users.id,
            name: users.fullName,
            email: users.email,
            role: roles.name
        })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id));

        console.log('Users:', allUsers);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

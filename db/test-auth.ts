import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function testAuth() {
    console.log('Testing auth...');
    const user = await db.query.users.findFirst({
        where: eq(users.identifier, 'admin1')
    });
    console.log('Admin user found:', user ? user.identifier : 'not found');
    console.log('Admin status:', user?.status);
    if (user && user.passwordHash) {
        const match = await bcrypt.compare('admin', user.passwordHash);
        console.log('Admin password match ("admin"):', match);
    }

    process.exit(0);
}
testAuth();

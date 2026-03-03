import { db } from './index';
import { permissions, rolePermissions, userPermissions } from './schema';

async function main() {
    try {
        console.log('Deleting existing permissions...');
        await db.delete(userPermissions);
        await db.delete(rolePermissions);
        await db.delete(permissions);
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();

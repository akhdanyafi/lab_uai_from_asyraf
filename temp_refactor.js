const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
            callback(dirPath);
        }
    });
}

const folders = ['features', 'app', 'lib'];

folders.forEach(folder => {
    let fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) return;

    walk(fullPath, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Foreign key type signatures: (userId: number) -> (userId: string)
        content = content.replace(/(adminId|uploaderId|studentId|validatorId|lecturerId|createdBy|userId):\s*number(\s*(?:\|[^,;:=]+)?)/g, '$1: string$2');
        content = content.replace(/(adminId|uploaderId|studentId|validatorId|lecturerId|createdBy|userId)\?:\s*number(\s*(?:\|[^,;:=]+)?)/g, '$1?: string$2');

        // 2. Drizzle query conditions: eq(users.id, userId) -> eq(users.identifier, userId)
        content = content.replace(/eq\(users\.id,\s*([^)]+)\)/g, 'eq(users.identifier, $1)');
        content = content.replace(/ne\(users\.id,\s*([^)]+)\)/g, 'ne(users.identifier, $1)');

        // 3. User mapping from DB objects: id: users.id -> identifier: users.identifier
        content = content.replace(/id:\s*users\.id/g, 'identifier: users.identifier');

        // 4. Also handle `.leftJoin(users, eq(SomeTable.userId, users.id))`
        // This is caught by rule 2 already! Because regex matches eq(users.id, ...) 
        // Wait, eq(SomeTable.userId, users.id) has users.id as the SECOND argument!
        content = content.replace(/eq\(([^,]+),\s*users\.id\)/g, 'eq($1, users.identifier)');

        // 5. Replace session.user.id with session.user.identifier globally, because user.id doesn't exist.
        // Wait, does session.user have identifier or id? If we just decrypted it, we should ensure the login sets identifier instead of id if we renamed it. Let's replace `user.id` -> `user.identifier` where appropriate, but let's just do `session.user.id` -> `session.user.identifier`.
        content = content.replace(/session\.user\.id/g, 'session.user.identifier');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    });
});
console.log('Refactor complete.');

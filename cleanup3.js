const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walk(dirPath, callback);
        } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
            callback(dirPath);
        }
    });
}

const folders = ['app', 'features', 'lib'];

folders.forEach(dir => {
    let fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) return;
    walk(fullPath, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // fix identifierentifier -> identifier
        content = content.replace(/identifierentifier/g, 'identifier');

        // replace lecturer.id -> lecturer.identifier
        content = content.replace(/lecturer\.id/g, 'lecturer.identifier');

        // replace user.id -> user.identifier
        content = content.replace(/user\.id/g, 'user.identifier');

        // replace user?.id -> user?.identifier
        content = content.replace(/user\?\.id/g, 'user?.identifier');

        // remove duplicates
        const lines = content.split('\n');
        const newLines = [];
        let prevLineTrimmed = '';
        for (let line of lines) {
            let trimmed = line.trim();
            if (trimmed === 'identifier: users.identifier,' && prevLineTrimmed === 'identifier: users.identifier,') continue;
            if (trimmed === 'identifier: string;' && prevLineTrimmed === 'identifier: string;') continue;

            // For object literals duplicate property 'identifier'
            if (trimmed === 'identifier: user.identifier,' && prevLineTrimmed === 'identifier: user.identifier,') continue;

            newLines.push(line);
            prevLineTrimmed = trimmed;
        }
        content = newLines.join('\n');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    });
});
console.log('Cleanup 3 done.');

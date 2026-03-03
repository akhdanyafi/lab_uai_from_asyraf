const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
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
    walk(fullPath, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        for (let i = 0; i < 5; i++) {
            content = content.replace(/identifierentifier/g, 'identifier');
        }

        content = content.replace(/identifier:\s*string;[\s\n]+identifier:\s*string;/g, 'identifier: string;');
        content = content.replace(/lecturer\.id\b/g, 'lecturer.identifier');
        content = content.replace(/user\.id\b/g, 'user.identifier');
        content = content.replace(/session\.user\.id\b/g, 'session.user.identifier');
        content = content.replace(/instructor\.id\b/g, 'instructor.identifier');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    });
});
console.log('Fix5 done.');

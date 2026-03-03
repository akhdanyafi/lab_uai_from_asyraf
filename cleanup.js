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

walk(path.join(__dirname, 'app'), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // sessionUserId: number -> sessionUserId: string
    content = content.replace(/sessionUserId:\s*number/g, 'sessionUserId: string');

    // interface Lecturer
    content = content.replace(/interface\s+Lecturer\s*\{\s*id:\s*number;/g, 'interface Lecturer {\n    identifier: string;');

    // app/admin/validations/page.tsx: user.id -> user.identifier
    content = content.replace(/user\.id/g, 'user.identifier');

    // adminDirectReturn(loanId, parseInt(formData.get...)) -> maybe don't blindly regex this

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
});

walk(path.join(__dirname, 'features'), (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // interface Lecturer
    content = content.replace(/interface\s+Lecturer\s*\{\s*id:\s*number;/g, 'interface Lecturer {\n    identifier: string;');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
});

console.log('Cleanup script done.');

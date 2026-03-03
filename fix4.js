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

        while (content.includes('identifierentifier')) {
            content = content.replace(/identifierentifier/g, 'identifier');
        }

        // Duplicate identifier in Lecturer
        content = content.replace(/identifier:\s*string;[\s\n]*identifier:\s*string;/g, 'identifier: string;');

        // Duplicate identifier in DB selects
        content = content.replace(/identifier:\s*users\.identifier,[\s\n]*identifier:\s*users\.identifier,/g, 'identifier: users.identifier,');
        content = content.replace(/identifier:\s*u\.identifier,[\s\n]*identifier:\s*u\.identifier,/g, 'identifier: u.identifier,');

        // Remaining user.id or lecturer.id
        content = content.replace(/lecturer\.id/g, 'lecturer.identifier');
        content = content.replace(/user\.id/g, 'user.identifier');
        content = content.replace(/session\.user\.id/g, 'session.user.identifier');
        content = content.replace(/instructor\.id/g, 'instructor.identifier');

        // CourseManager 84: Type 'number | null' is not assignable to type 'string | null | undefined'.
        // Let's change course.lecturerId as string | null if needed

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    });
});
console.log('Fix4 done.');

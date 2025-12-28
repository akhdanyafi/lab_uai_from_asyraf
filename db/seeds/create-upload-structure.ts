/**
 * Create Upload Folder Structure
 * Run this script to create the necessary upload folders
 */

import * as fs from 'fs';
import * as path from 'path';

const UPLOAD_FOLDERS = [
    'public/uploads/modules',
    'public/uploads/reports',
    'public/uploads/publications',
    'public/uploads/governance',
    'public/uploads/governance/covers',
    'public/uploads/photos',
];

async function createUploadStructure() {
    console.log('Creating upload folder structure...\n');

    for (const folder of UPLOAD_FOLDERS) {
        const folderPath = path.join(process.cwd(), folder);

        try {
            // Create folder if it doesn't exist
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`✅ Created: ${folder}`);
            } else {
                console.log(`⏭️  Already exists: ${folder}`);
            }

            // Create .gitkeep file to preserve empty folders in git
            const gitkeepPath = path.join(folderPath, '.gitkeep');
            if (!fs.existsSync(gitkeepPath)) {
                fs.writeFileSync(gitkeepPath, '');
                console.log(`   Added .gitkeep to ${folder}`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${folder}:`, error);
        }
    }

    console.log('\n✨ Upload folder structure created successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Add your PDF/image files to the appropriate folders');
    console.log('   2. Run the database seed: npm run db:seed');
    console.log('   3. Files should match the naming convention used in seed data\n');
}

// Run if executed directly
if (require.main === module) {
    createUploadStructure();
}

export { createUploadStructure };

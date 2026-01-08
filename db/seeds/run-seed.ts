/**
 * Main Seed Runner
 * Execute database seeding
 */

import { createUploadStructure } from './create-upload-structure';
import { runComprehensiveSeed } from './comprehensive.seed';

async function main() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   LAB UAI - Database Seeding System            ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    try {
        // Step 1: Create upload folder structure
        console.log('Step 1: Creating upload folder structure...');
        await createUploadStructure();

        // Step 2: Run comprehensive seeds
        console.log('\nStep 2: Seeding database...');
        await runComprehensiveSeed();

        console.log('\n╔════════════════════════════════════════════════╗');
        console.log('║   ✨ Database seeding completed successfully!  ║');
        console.log('╚════════════════════════════════════════════════╝\n');

        process.exit(0);
    } catch (error) {
        console.error('\n╔════════════════════════════════════════════════╗');
        console.error('║   ❌ Database seeding failed!                  ║');
        console.error('╚════════════════════════════════════════════════╝\n');
        console.error('Error details:', error);
        process.exit(1);
    }
}

main();

import { db } from "./db";
import { publications, modules, practicalReports } from "./db/schema";

async function main() {
    try {
        console.log("Checking publications table...");
        await db.select().from(publications).limit(1);
        console.log("Publications table exists.");

        console.log("Checking modules table...");
        await db.select().from(modules).limit(1);
        console.log("Modules table exists.");

        console.log("Checking practicalReports table...");
        await db.select().from(practicalReports).limit(1);
        console.log("PracticalReports table exists.");

        console.log("Schema verification successful!");
    } catch (error) {
        console.error("Schema verification failed:", error);
    }
    process.exit(0);
}

main();

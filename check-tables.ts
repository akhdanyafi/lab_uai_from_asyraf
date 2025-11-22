import { db } from "./db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking tables...");
    const result = await db.execute(sql`SHOW TABLES`);
    console.log(result);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

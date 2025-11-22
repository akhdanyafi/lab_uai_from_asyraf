import { db } from "./db";
import { roles, users } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding database...");

    // Seed Roles
    const roleNames = ["Admin", "Mahasiswa", "Dosen"];

    for (const name of roleNames) {
        const existing = await db.select().from(roles).where(eq(roles.name, name));
        if (existing.length === 0) {
            await db.insert(roles).values({ name });
            console.log(`Created role: ${name}`);
        }
    }

    // Get Role IDs
    const adminRole = (await db.select().from(roles).where(eq(roles.name, "Admin")))[0];
    const studentRole = (await db.select().from(roles).where(eq(roles.name, "Mahasiswa")))[0];
    const lecturerRole = (await db.select().from(roles).where(eq(roles.name, "Dosen")))[0];

    // Seed Admin User
    const adminEmail = "admin@uai.ac.id";
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));

    if (existingAdmin.length === 0) {
        await db.insert(users).values({
            roleId: adminRole.id,
            fullName: "Administrator Lab",
            identifier: "ADMIN001",
            email: adminEmail,
            passwordHash: "admin", // Plain text for demo, hash in production
        });
        console.log("Created admin user");
    }

    // Seed Student User
    const studentEmail = "mahasiswa@uai.ac.id";
    const existingStudent = await db.select().from(users).where(eq(users.email, studentEmail));

    if (existingStudent.length === 0) {
        await db.insert(users).values({
            roleId: studentRole.id,
            fullName: "Mahasiswa Contoh",
            identifier: "123456789",
            email: studentEmail,
            passwordHash: "mahasiswa",
        });
        console.log("Created student user");
    }

    console.log("Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

import { db } from "../db";
import { roles, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
        const hashedPassword = await bcrypt.hash("admin", 10);
        await db.insert(users).values({
            roleId: adminRole.id,
            fullName: "Administrator Lab",
            identifier: "1",
            email: adminEmail,
            passwordHash: hashedPassword,
            status: 'Active',
        });
        console.log("Created admin user");
    }

    // Seed Student User
    const studentEmail = "mahasiswa@uai.ac.id";
    const existingStudent = await db.select().from(users).where(eq(users.email, studentEmail));

    if (existingStudent.length === 0) {
        const hashedPassword = await bcrypt.hash("mahasiswa", 10);
        await db.insert(users).values({
            roleId: studentRole.id,
            fullName: "Mahasiswa Contoh",
            identifier: "2",
            email: studentEmail,
            passwordHash: hashedPassword,
            status: 'Active',
        });
        console.log("Created student user");
    }
    // Seed Lecturer User
    const dosenEmail = "dosen@uai.ac.id";
    const existingDosen = await db.select().from(users).where(eq(users.email, dosenEmail));

    if (existingDosen.length === 0) {
        const hashedPassword = await bcrypt.hash("dosen", 10);
        await db.insert(users).values({
            roleId: lecturerRole.id,
            fullName: "Dosen Contoh",
            identifier: "3",
            email: dosenEmail,
            passwordHash: hashedPassword,
            status: 'Active',
        });
        console.log("Created lecturer user");
    }
    console.log("Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

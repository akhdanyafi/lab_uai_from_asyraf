import { db } from "../db";
import { governanceDocs, users, roles } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding SOPs...");

    // Get Admin User
    const adminRole = (await db.select().from(roles).where(eq(roles.name, "Admin")))[0];
    if (!adminRole) {
        console.error("Admin role not found. Run seed.ts first.");
        process.exit(1);
    }

    const adminUser = (await db.select().from(users).where(eq(users.roleId, adminRole.id)))[0];
    if (!adminUser) {
        console.error("Admin user not found. Run seed.ts first.");
        process.exit(1);
    }

    const sops = [
        {
            title: "SOP Peminjaman Ruangan",
            filePath: "https://example.com/sop-peminjaman-ruangan.pdf",
            type: "SOP" as const,
            adminId: adminUser.id,
        },
        {
            title: "SOP Penggunaan Alat Lab",
            filePath: "https://example.com/sop-alat-lab.pdf",
            type: "SOP" as const,
            adminId: adminUser.id,
        },
        {
            title: "SOP Keselamatan Kerja",
            filePath: "https://example.com/sop-k3.pdf",
            type: "SOP" as const,
            adminId: adminUser.id,
        },
        {
            title: "SOP Pelaporan Kerusakan",
            filePath: "https://example.com/sop-kerusakan.pdf",
            type: "SOP" as const,
            adminId: adminUser.id,
        },
    ];

    for (const sop of sops) {
        await db.insert(governanceDocs).values(sop);
        console.log(`Created SOP: ${sop.title}`);
    }

    console.log("SOP Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

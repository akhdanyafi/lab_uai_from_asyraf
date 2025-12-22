/**
 * Initial Database Seed
 * Seeds initial data for the application
 */

import { db } from '@/db';
import { roles, rooms, itemCategories, courses } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { users } from '@/db/schema/users';

/**
 * Seed initial roles
 */
export async function seedRoles() {
    console.log('Seeding roles...');

    const existingRoles = await db.select().from(roles);
    if (existingRoles.length > 0) {
        console.log('Roles already exist, skipping...');
        return;
    }

    await db.insert(roles).values([
        { name: 'Admin' },
        { name: 'Mahasiswa' },
        { name: 'Dosen' },
    ]);

    console.log('Roles seeded successfully!');
}

/**
 * Seed initial admin user
 */
export async function seedAdminUser() {
    console.log('Seeding admin user...');

    const existingAdmin = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'admin@lab-uai.ac.id')
    });

    if (existingAdmin) {
        console.log('Admin user already exists, skipping...');
        return;
    }

    // Get admin role
    const adminRole = await db.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.name, 'Admin')
    });

    if (!adminRole) {
        throw new Error('Admin role not found. Please seed roles first.');
    }

    const hashedPassword = await bcrypt.hash('admin', 10);

    await db.insert(users).values({
        fullName: 'Administrator',
        identifier: '1',
        email: 'admin@lab.ac.id',
        passwordHash: hashedPassword,
        roleId: adminRole.id,
        status: 'Active',
    });

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@lab-uai.ac.id');
    console.log('Password: admin123');
}

/**
 * Seed sample rooms
 */
export async function seedRooms() {
    console.log('Seeding rooms...');

    const existingRooms = await db.select().from(rooms);
    if (existingRooms.length > 0) {
        console.log('Rooms already exist, skipping...');
        return;
    }

    await db.insert(rooms).values([
        { name: 'Lab Komputer 1', location: 'Gedung A, Lantai 6', capacity: 40 },
        { name: 'Lab Komputer 2', location: 'Gedung A, Lantai 6', capacity: 40 },
        { name: 'Lab Jaringan', location: 'Gedung A, Lantai 6', capacity: 30 },
        { name: 'Lab Multimedia', location: 'Gedung A, Lantai 6', capacity: 25 },
    ]);

    console.log('Rooms seeded successfully!');
}

/**
 * Seed sample item categories
 */
export async function seedCategories() {
    console.log('Seeding item categories...');

    const existingCategories = await db.select().from(itemCategories);
    if (existingCategories.length > 0) {
        console.log('Categories already exist, skipping...');
        return;
    }

    await db.insert(itemCategories).values([
        { name: 'Komputer' },
        { name: 'Monitor' },
        { name: 'Keyboard' },
        { name: 'Mouse' },
        { name: 'Proyektor' },
        { name: 'Kabel & Aksesoris' },
    ]);

    console.log('Categories seeded successfully!');
}

/**
 * Seed sample courses
 */
export async function seedCourses() {
    console.log('Seeding courses...');

    const existingCourses = await db.select().from(courses);
    if (existingCourses.length > 0) {
        console.log('Courses already exist, skipping...');
        return;
    }

    await db.insert(courses).values([
        { code: 'IF22A', name: 'Algoritma dan Pemrograman', description: 'Dasar-dasar algoritma dan pemrograman' },
        { code: 'IF22A', name: 'Struktur Data', description: 'Konsep struktur data dan implementasinya' },
        { code: 'IF22A', name: 'Basis Data', description: 'Sistem manajemen basis data' },
        { code: 'IF22A', name: 'Jaringan Komputer', description: 'Konsep jaringan komputer dan protokol' },
    ]);

    console.log('Courses seeded successfully!');
}

/**
 * Run all seeds
 */
export async function runAllSeeds() {
    console.log('Starting database seeding...\n');

    await seedRoles();
    await seedAdminUser();
    await seedRooms();
    await seedCategories();
    await seedCourses();

    console.log('\n✅ All seeds completed successfully!');
}

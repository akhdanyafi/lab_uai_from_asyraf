/**
 * Comprehensive Database Seed
 * Seeds ALL tables with realistic sample data
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed: courses table (merged into classes)
 * - Removed: modules table (merged into assignments)
 * - Renamed: practicalSessions -> assignments
 * - Added: enrollmentKey, courseCode, courseName to classes
 */

import { db } from '@/db';
import {
    roles, users,
    classes, classEnrollments, assignments, practicalReports,
    rooms, roomBookings,
    itemCategories, items, itemLoans,
    labAttendance,
    governanceDocs, publications, heroPhotos,
    generateEnrollmentKey
} from '@/db/schema';
import bcrypt from 'bcryptjs';
import { SEED_CONFIG, SAMPLE_DATA } from './seed.config';

/**
 * Helper: Get random items from array
 */
function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Helper: Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Helper: Generate date offset from now
 */
function dateOffset(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * 1. Seed Roles (if not exists)
 */
export async function seedRoles() {
    console.log('🔑 Seeding roles...');

    const existingRoles = await db.select().from(roles);
    if (existingRoles.length > 0) {
        console.log('   ⏭️  Roles already exist, skipping...');
        return existingRoles;
    }

    const roleData = [
        { name: 'Admin' },
        { name: 'Dosen' },
        { name: 'Mahasiswa' },
    ];

    await db.insert(roles).values(roleData);
    const createdRoles = await db.select().from(roles);
    console.log(`   ✅ Created ${createdRoles.length} roles`);
    return createdRoles;
}

/**
 * 2. Seed Users (Admin, Dosen, Mahasiswa)
 */
export async function seedUsers() {
    console.log('\n👥 Seeding users...');

    const allRoles = await db.select().from(roles);
    const adminRole = allRoles.find(r => r.name === 'Admin')!;
    const dosenRole = allRoles.find(r => r.name === 'Dosen')!;
    const mahasiswaRole = allRoles.find(r => r.name === 'Mahasiswa')!;

    // Create different passwords for each role
    const adminPassword = await bcrypt.hash('admin', 10);
    const dosenPassword = await bcrypt.hash('dosen', 10);
    const mahasiswaPassword = await bcrypt.hash('mahasiswa', 10);

    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'admin@lab.ac.id')
    });

    if (!existingAdmin) {
        await db.insert(users).values({
            fullName: 'Administrator',
            identifier: 'admin1',
            email: 'admin@lab.ac.id',
            passwordHash: adminPassword,
            roleId: adminRole.id,
            status: 'Active',
        });
        console.log('   ✅ Created admin user (password: admin)');
    } else {
        console.log('   ⏭️  Admin already exists');
    }

    // Seed Lecturers
    const lecturerData = SAMPLE_DATA.lecturers
        .slice(0, SEED_CONFIG.users.lecturersCount)
        .map(lecturer => ({
            fullName: lecturer.fullName,
            identifier: lecturer.identifier,
            email: lecturer.email,
            passwordHash: dosenPassword,
            roleId: dosenRole.id,
            status: 'Active' as const,
        }));

    for (const lecturer of lecturerData) {
        const existing = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, lecturer.email)
        });
        if (!existing) {
            await db.insert(users).values(lecturer);
        }
    }
    console.log(`   ✅ Created/verified ${lecturerData.length} lecturers (password: dosen)`);

    // Get all lecturers for assigning as dosen pembimbing
    const allLecturers = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.roleId, dosenRole.id)
    });

    // Seed Students
    const studentData = SAMPLE_DATA.students
        .slice(0, SEED_CONFIG.users.studentsCount)
        .map(student => ({
            fullName: student.fullName,
            identifier: student.identifier,
            email: student.email,
            passwordHash: mahasiswaPassword,
            roleId: mahasiswaRole.id,
            status: 'Active' as const,
            batch: student.batch,
            studyType: student.studyType as 'Reguler' | 'Hybrid',
            programStudi: 'Informatika',
            dosenPembimbing: getRandomItem(allLecturers).fullName,
        }));

    for (const student of studentData) {
        const existing = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, student.email)
        });
        if (!existing) {
            await db.insert(users).values(student);
        }
    }
    console.log(`   ✅ Created/verified ${studentData.length} students (password: mahasiswa)`);

    return await db.select().from(users);
}

/**
 * 3. Seed Classes (Now includes course info directly - courses table removed)
 */
export async function seedClasses() {
    console.log('\n🏫 Seeding classes (with embedded course info)...');

    const existingClasses = await db.select().from(classes);
    if (existingClasses.length > 0) {
        console.log('   ⏭️  Classes already exist, skipping...');
        return existingClasses;
    }

    const dosenRole = await db.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.name, 'Dosen')
    });
    const lecturers = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.roleId, dosenRole!.id)
    });

    const classNames = ['A', 'B', 'C', 'D'];
    const classData = [];

    // Create classes for each course in SAMPLE_DATA
    for (let i = 0; i < Math.min(SEED_CONFIG.academic.classesCount, SAMPLE_DATA.courses.length * 2); i++) {
        const course = SAMPLE_DATA.courses[i % SAMPLE_DATA.courses.length];
        const lecturer = getRandomItem(lecturers);
        const className = classNames[i % classNames.length];
        const semester = getRandomItem(SAMPLE_DATA.semesters);
        const uniqueClassName = `IF-${course.code.substring(2)}-${className}${i}`;

        // Generate unique enrollment key with index to avoid duplicates
        const enrollmentKey = generateEnrollmentKey(course.code, uniqueClassName);

        classData.push({
            courseCode: course.code,
            courseName: course.name,
            lecturerId: lecturer.id,
            name: uniqueClassName,
            semester,
            enrollmentKey,
        });
    }

    await db.insert(classes).values(classData);
    const createdClasses = await db.select().from(classes);
    console.log(`   ✅ Created ${createdClasses.length} classes`);
    console.log(`   🔑 Enrollment keys generated for self-enrollment`);
    return createdClasses;
}

/**
 * 4. Seed Class Enrollments
 */
export async function seedClassEnrollments() {
    console.log('\n📝 Seeding class enrollments...');

    const existingEnrollments = await db.select().from(classEnrollments);
    if (existingEnrollments.length > 0) {
        console.log('   ⏭️  Enrollments already exist, skipping...');
        return existingEnrollments;
    }

    const allClasses = await db.select().from(classes);
    const mahasiswaRole = await db.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.name, 'Mahasiswa')
    });
    const students = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.roleId, mahasiswaRole!.id)
    });

    const enrollmentData = [];

    for (const classItem of allClasses) {
        // Enroll 4-7 random students per class
        const studentsToEnroll = getRandomItems(students, 4 + Math.floor(Math.random() * 4));

        for (const student of studentsToEnroll) {
            enrollmentData.push({
                classId: classItem.id,
                studentId: student.id,
            });
        }
    }

    await db.insert(classEnrollments).values(enrollmentData);
    console.log(`   ✅ Created ${enrollmentData.length} enrollments`);
    return enrollmentData;
}

/**
 * 5. Seed Assignments (Previously modules + practicalSessions combined)
 */
export async function seedAssignments() {
    console.log('\n📄 Seeding assignments (combines modules + sessions)...');

    const existingAssignments = await db.select().from(assignments);
    if (existingAssignments.length > 0) {
        console.log('   ⏭️  Assignments already exist, skipping...');
        return existingAssignments;
    }

    const allClasses = await db.select().from(classes);
    const assignmentData: Array<{
        classId: number;
        title: string;
        description: string;
        filePath: string;
        order: number;
        startDate: Date;
        deadline: Date;
    }> = [];

    for (const classItem of allClasses) {
        // Create assignments (previously modules + sessions)
        for (let i = 1; i <= SEED_CONFIG.academic.modulesPerCourse; i++) {
            const startDate = dateOffset(-30 + (i * 7)); // Stagger assignments weekly
            const deadline = dateOffset(-30 + (i * 7) + 14); // 2 weeks per assignment

            assignmentData.push({
                classId: classItem.id,
                title: `Praktikum ${i} - ${classItem.courseName}`,
                description: `Materi praktikum modul ${i} untuk mata kuliah ${classItem.courseName}. Silakan kerjakan tugas sesuai petunjuk di file PDF.`,
                filePath: `/uploads/assignments/praktikum${i}.pdf`,
                order: i,
                startDate,
                deadline,
            });
        }
    }

    await db.insert(assignments).values(assignmentData);
    console.log(`   ✅ Created ${assignmentData.length} assignments`);
    console.log('   📌 Note: Add PDF files to public/uploads/assignments/');
    return assignmentData;
}

/**
 * 6. Seed Practical Reports
 */
export async function seedPracticalReports() {
    console.log('\n📋 Seeding practical reports...');

    const existingReports = await db.select().from(practicalReports);
    if (existingReports.length > 0) {
        console.log('   ⏭️  Reports already exist, skipping...');
        return existingReports;
    }

    const allAssignments = await db.select().from(assignments);
    const reportData = [];

    for (const assignment of allAssignments) {
        // Get students enrolled in this assignment's class
        const enrollments = await db.query.classEnrollments.findMany({
            where: (classEnrollments, { eq }) => eq(classEnrollments.classId, assignment.classId)
        });

        // Random subset of students submit reports
        const studentsToSubmit = getRandomItems(
            enrollments,
            Math.min(SEED_CONFIG.academic.reportsPerSession, enrollments.length)
        );

        for (const enrollment of studentsToSubmit) {
            const submissionDate = new Date(assignment.startDate);
            submissionDate.setDate(submissionDate.getDate() + Math.floor(Math.random() * 10));

            // Random: some graded, some not
            const isGraded = Math.random() > 0.3;
            const grade = isGraded ? 70 + Math.floor(Math.random() * 30) : null;
            const feedback = isGraded ? 'Good work! Keep it up.' : null;

            reportData.push({
                assignmentId: assignment.id,
                studentId: enrollment.studentId,
                filePath: `/uploads/reports/session1.pdf`,
                submissionDate,
                grade,
                feedback,
            });
        }
    }

    if (reportData.length > 0) {
        await db.insert(practicalReports).values(reportData);
    }
    console.log(`   ✅ Created ${reportData.length} reports`);
    console.log('   📌 Note: Add PDF files to public/uploads/reports/');
    return reportData;
}

/**
 * 7. Seed Rooms
 */
export async function seedRooms() {
    console.log('\n🏢 Seeding rooms...');

    const existingRooms = await db.select().from(rooms);
    if (existingRooms.length > 0) {
        console.log('   ⏭️  Rooms already exist, skipping...');
        return existingRooms;
    }

    const roomData = [
        { name: 'Lab Informatika', location: '613, Lantai 6', capacity: 40, status: 'Tersedia' as const },
        { name: 'Lab Computer Vision', location: '613A, Lantai 6', capacity: 40, status: 'Tersedia' as const },
        { name: 'Lab Data Science & Software Engineering', location: '613B, Lantai 6', capacity: 30, status: 'Tersedia' as const },
        { name: 'Lab Server & Database', location: '614, Lantai 6', capacity: 25, status: 'Tersedia' as const },
        { name: 'Lab Testing', location: '615, Lantai 6', capacity: 20, status: 'Maintenance' as const },
    ];
    await db.insert(rooms).values(roomData);
    console.log(`   ✅ Created ${roomData.length} rooms`);
    return roomData;
}

/**
 * 8. Seed Room Bookings
 */
export async function seedRoomBookings() {
    console.log('\n🔖 Seeding room bookings...');

    const existingBookings = await db.select().from(roomBookings);
    if (existingBookings.length > 0) {
        console.log('   ⏭️  Bookings already exist, skipping...');
        return existingBookings;
    }

    const allRooms = await db.select().from(rooms);
    const allUsers = await db.select().from(users);
    const admins = allUsers.filter(u => {
        return u.email.includes('admin') || u.email.includes('lab.ac.id');
    });

    const bookingData = [];
    const purposes = [
        'Penelitian/Riset',
        'Kegiatan belajar mandiri / kelompok',
        'Rapat HIMA / organisasi',
        'Praktikum atau persiapan tugas',
        'Kehadiran di area laboratorium',
    ];

    const statuses: Array<'Pending' | 'Disetujui' | 'Ditolak'> = ['Pending', 'Disetujui', 'Ditolak'];

    for (let i = 0; i < SEED_CONFIG.facilities.roomBookingsCount; i++) {
        const user = getRandomItem(allUsers);
        const room = getRandomItem(allRooms);
        const status = getRandomItem(statuses);
        const validator = status !== 'Pending' ? getRandomItem(admins).id : null;

        const startTime = dateOffset(-10 + i);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        bookingData.push({
            userId: user.id,
            roomId: room.id,
            validatorId: validator,
            startTime,
            endTime,
            purpose: getRandomItem(purposes),
            status,
        });
    }

    await db.insert(roomBookings).values(bookingData);
    console.log(`   ✅ Created ${bookingData.length} bookings`);
    return bookingData;
}

/**
 * 9. Seed Item Categories
 */
export async function seedItemCategories() {
    console.log('\n📦 Seeding item categories...');

    const existingCategories = await db.select().from(itemCategories);
    if (existingCategories.length > 0) {
        console.log('   ⏭️  Categories already exist, skipping...');
        return existingCategories;
    }

    const categoryData = SAMPLE_DATA.itemCategories.map(name => ({ name }));
    await db.insert(itemCategories).values(categoryData);

    console.log(`   ✅ Created ${categoryData.length} categories`);
    return categoryData;
}

/**
 * 10. Seed Items
 */
export async function seedItems() {
    console.log('\n💻 Seeding items...');

    const existingItems = await db.select().from(items);
    if (existingItems.length > 0) {
        console.log('   ⏭️  Items already exist, skipping...');
        return existingItems;
    }

    const categories = await db.select().from(itemCategories);
    const allRooms = await db.select().from(rooms);
    const itemData = [];

    for (const category of categories) {
        for (let i = 1; i <= SEED_CONFIG.facilities.itemsPerCategory; i++) {
            const room = getRandomItem(allRooms);
            itemData.push({
                categoryId: category.id,
                roomId: room.id,
                name: `${category.name} ${i}`,
                description: `${category.name} untuk keperluan praktikum`,
                qrCode: `QR-${category.name.toUpperCase()}-${String(i).padStart(3, '0')}`,
                status: getRandomItem(['Tersedia', 'Tersedia', 'Tersedia', 'Maintenance']) as 'Tersedia' | 'Dipinjam' | 'Maintenance',
            });
        }
    }

    await db.insert(items).values(itemData);
    console.log(`   ✅ Created ${itemData.length} items`);
    return itemData;
}

/**
 * 11. Seed Item Loans
 */
export async function seedItemLoans() {
    console.log('\n🔄 Seeding item loans...');

    const existingLoans = await db.select().from(itemLoans);
    if (existingLoans.length > 0) {
        console.log('   ⏭️  Loans already exist, skipping...');
        return existingLoans;
    }

    const allItems = await db.select().from(items);
    const students = await db.query.users.findMany();
    const admins = students.filter(u => u.email.includes('admin'));

    const loanData = [];
    const statuses: Array<'Pending' | 'Disetujui' | 'Ditolak' | 'Selesai' | 'Terlambat'> =
        ['Pending', 'Disetujui', 'Ditolak', 'Selesai', 'Terlambat'];

    for (let i = 0; i < SEED_CONFIG.facilities.itemLoansCount; i++) {
        const student = getRandomItem(students);
        const item = getRandomItem(allItems);
        const status = getRandomItem(statuses);
        const validator = status !== 'Pending' ? getRandomItem(admins).id : null;

        const requestDate = dateOffset(-20 + i);
        const returnPlanDate = dateOffset(-20 + i + 7);
        const actualReturnDate = status === 'Selesai' ? dateOffset(-20 + i + 6) :
            status === 'Terlambat' ? dateOffset(-20 + i + 10) : null;

        loanData.push({
            studentId: student.id,
            itemId: item.id,
            validatorId: validator,
            requestDate,
            returnPlanDate,
            actualReturnDate,
            status,
        });
    }

    await db.insert(itemLoans).values(loanData);
    console.log(`   ✅ Created ${loanData.length} loans`);
    return loanData;
}

/**
 * 12. Seed Lab Attendance
 */
export async function seedLabAttendance() {
    console.log('\n✅ Seeding lab attendance...');

    const existingAttendance = await db.select().from(labAttendance);
    if (existingAttendance.length > 0) {
        console.log('   ⏭️  Attendance already exists, skipping...');
        return existingAttendance;
    }

    const allUsers = await db.select().from(users);
    const allRooms = await db.select().from(rooms);
    const purposes = [
        'Penelitian/Riset',
        'Kegiatan belajar mandiri / kelompok',
        'Rapat HIMA / organisasi',
        'Praktikum atau persiapan tugas',
        'Kehadiran di area laboratorium',
    ];

    const attendanceData = [];

    for (let i = 0; i < SEED_CONFIG.facilities.labAttendanceCount; i++) {
        const user = getRandomItem(allUsers);
        const room = getRandomItem(allRooms);
        const checkInTime = dateOffset(-15 + Math.floor(i / 2));
        checkInTime.setHours(8 + Math.floor(Math.random() * 10));

        // Use user's dosenPembimbing or a default name
        const dosenPenanggungJawab = user.dosenPembimbing || 'Dr. Budi Santoso, M.Kom';

        attendanceData.push({
            userId: user.id,
            roomId: room.id,
            purpose: getRandomItem(purposes),
            dosenPenanggungJawab,
            checkInTime,
        });
    }

    await db.insert(labAttendance).values(attendanceData);
    console.log(`   ✅ Created ${attendanceData.length} attendance records`);
    return attendanceData;
}

/**
 * 13. Seed Governance Docs
 */
export async function seedGovernanceDocs() {
    console.log('\n📑 Seeding governance documents...');

    const existingDocs = await db.select().from(governanceDocs);
    if (existingDocs.length > 0) {
        console.log('   ⏭️  Governance docs already exist, skipping...');
        return existingDocs;
    }

    const admin = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'admin@lab.ac.id')
    });

    if (!admin) {
        console.log('   ⚠️  Admin not found, skipping governance docs');
        return [];
    }

    const docData = SAMPLE_DATA.governanceDocs.slice(0, SEED_CONFIG.content.governanceDocsCount).map((doc, i) => ({
        adminId: admin.id,
        title: doc.title,
        filePath: `/uploads/governance/${doc.type.toLowerCase().replace(' ', '-')}-${i + 1}.pdf`,
        coverPath: `/uploads/governance/covers/${doc.type.toLowerCase().replace(' ', '-')}-${i + 1}.jpg`,
        type: doc.type,
    }));

    await db.insert(governanceDocs).values(docData);
    console.log(`   ✅ Created ${docData.length} governance docs`);
    console.log('   📌 Note: Add PDF files to public/uploads/governance/');
    return docData;
}

/**
 * 14. Seed Publications
 */
export async function seedPublications() {
    console.log('\n📰 Seeding publications...');

    const existingPubs = await db.select().from(publications);
    if (existingPubs.length > 0) {
        console.log('   ⏭️  Publications already exist, skipping...');
        return existingPubs;
    }

    const allUsers = await db.select().from(users);
    const uploaders = allUsers.filter(u => u.email.includes('lab.ac.id'));

    const pubData = SAMPLE_DATA.publications.slice(0, SEED_CONFIG.content.publicationsCount).map((pub, i) => {
        const hasFile = Math.random() > 0.3; // 70% have files, 30% external links

        return {
            uploaderId: getRandomItem(uploaders).id,
            authorName: pub.authorName,
            title: pub.title,
            abstract: pub.abstract,
            filePath: hasFile ? `/uploads/publications/publication-${i + 1}.pdf` : null,
            link: hasFile ? null : 'https://example.com/external-publication',
            viewCount: Math.floor(Math.random() * 500),
            publishDate: dateOffset(-365 + (i * 30)),
        };
    });

    await db.insert(publications).values(pubData);
    console.log(`   ✅ Created ${pubData.length} publications`);
    console.log('   📌 Note: Add PDF files to public/uploads/publications/');
    return pubData;
}

/**
 * 15. Seed Hero Photos
 */
export async function seedHeroPhotos() {
    console.log('\n🖼️  Seeding hero photos...');

    const existingPhotos = await db.select().from(heroPhotos);
    if (existingPhotos.length > 0) {
        console.log('   ⏭️  Hero photos already exist, skipping...');
        return existingPhotos;
    }

    const photoData = SAMPLE_DATA.heroPhotos.slice(0, SEED_CONFIG.content.heroPhotosCount).map((photo, i) => ({
        title: photo.title,
        description: photo.description,
        imageUrl: `/uploads/photos/hero-${i + 1}.jpg`,
        link: Math.random() > 0.5 ? 'https://example.com/event-details' : null,
    }));

    await db.insert(heroPhotos).values(photoData);
    console.log(`   ✅ Created ${photoData.length} hero photos`);
    console.log('   📌 Note: Add image files to public/uploads/photos/');
    return photoData;
}

/**
 * Run all comprehensive seeds
 */
export async function runComprehensiveSeeds() {
    console.log('🚀 Starting comprehensive database seeding (SIMPLIFIED SCHEMA)...\n');
    console.log('═'.repeat(50));

    try {
        await seedRoles();
        await seedUsers();
        // NOTE: seedCourses and seedModules removed - data now embedded in classes/assignments
        await seedClasses();
        await seedClassEnrollments();
        await seedAssignments(); // Previously seedModules + seedPracticalSessions
        await seedPracticalReports();
        await seedRooms();
        await seedRoomBookings();
        await seedItemCategories();
        await seedItems();
        await seedItemLoans();
        await seedLabAttendance();
        await seedGovernanceDocs();
        await seedPublications();
        await seedHeroPhotos();

        console.log('\n═'.repeat(50));
        console.log('\n✨ All seeds completed successfully!');
        console.log('\n📋 Summary (Simplified Schema):');
        console.log('   - Roles: ✅');
        console.log('   - Users: ✅');
        console.log('   - Classes (with embedded course info): ✅');
        console.log('   - Class Enrollments: ✅');
        console.log('   - Assignments (combines modules + sessions): ✅');
        console.log('   - Practical Reports: ✅');
        console.log('   - Facilities: ✅');
        console.log('   - Content: ✅');
        console.log('\n🔐 Test Credentials:');
        console.log('   Admin: admin@lab.ac.id / admin');
        console.log('   Lecturer: budi.santoso@lab.ac.id / dosen');
        console.log('   Student: andi.wijaya@student.ac.id / mahasiswa');
        console.log('\n🔑 Enrollment Keys:');
        console.log('   Classes have auto-generated enrollment keys.');
        console.log('   Students can self-enroll by entering the key.');
        console.log('\n📌 Next Steps:');
        console.log('   1. Add actual files to public/uploads/ folders');
        console.log('   2. Files should match the naming patterns used in seeds');
        console.log('   3. Check the database to verify all data is correct\n');

    } catch (error) {
        console.error('\n❌ Error during seeding:', error);
        throw error;
    }
}

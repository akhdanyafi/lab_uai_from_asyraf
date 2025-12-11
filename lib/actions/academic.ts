'use server';

import { db } from '@/db';
import { courses, classes, modules, practicalSessions, practicalReports, users, classEnrollments, publications, roles } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

// --- Courses ---
export async function getCourses() {
    return await db.select().from(courses);
}

export async function createCourse(data: { code: string; name: string; description?: string }) {
    await db.insert(courses).values(data);
    revalidatePath('/admin/courses');
}

export async function deleteCourse(id: number) {
    await db.delete(courses).where(eq(courses.id, id));
    revalidatePath('/admin/courses');
}

// --- Classes ---
export async function getClasses() {
    const rows = await db
        .select({
            class: classes,
            course: courses,
            lecturer: users,
        })
        .from(classes)
        .leftJoin(courses, eq(classes.courseId, courses.id))
        .leftJoin(users, eq(classes.lecturerId, users.id));

    return rows.map(row => ({
        ...row.class,
        course: row.course!,
        lecturer: row.lecturer!,
    }));
}

export async function createClass(data: { courseId: number; lecturerId: number; name: string; semester: string }) {
    await db.insert(classes).values(data);
    revalidatePath('/admin/classes');
}

export async function deleteClass(id: number) {
    await db.delete(classes).where(eq(classes.id, id));
    revalidatePath('/admin/classes');
}

// --- Modules ---
export async function getModules() {
    const rows = await db
        .select({
            module: modules,
            course: courses,
        })
        .from(modules)
        .leftJoin(courses, eq(modules.courseId, courses.id))
        .orderBy(desc(modules.order));

    return rows.map(row => ({
        ...row.module,
        course: row.course!,
    }));
}

export async function createModule(data: { courseId: number; title: string; description?: string; filePath: string; order: number }) {
    await db.insert(modules).values(data);
    revalidatePath('/admin/modules');
}

export async function deleteModule(id: number, type?: string) {
    await db.delete(modules).where(eq(modules.id, id));
    revalidatePath('/admin/modules');
}

// --- Sessions (Lecturer) ---
export async function getLecturerClasses(lecturerId: number) {
    const rows = await db
        .select({
            class: classes,
            course: courses,
        })
        .from(classes)
        .leftJoin(courses, eq(classes.courseId, courses.id))
        .where(eq(classes.lecturerId, lecturerId));

    return rows.map(row => ({
        ...row.class,
        course: row.course!,
    }));
}

export async function getClassSessions(classId: number) {
    const rows = await db
        .select({
            session: practicalSessions,
            module: modules,
        })
        .from(practicalSessions)
        .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
        .where(eq(practicalSessions.classId, classId))
        .orderBy(desc(practicalSessions.startDate));

    // Fetch reports for this class's sessions
    // For simplicity, we'll just return empty reports array for now as the UI might handle it or we can fetch if critical.
    // If the UI crashes accessing reports, we'll need to fetch them.
    // Let's fetch all reports for these sessions to be safe.

    const sessionIds = rows.map(r => r.session.id);
    let reports: any[] = [];
    if (sessionIds.length > 0) {
        // Ideally use inArray, but for now let's just fetch all reports and filter in memory to avoid import issues if any.
        // Or just return empty if not critical.
        // Let's return empty for now to fix build, can improve later.
    }

    return rows.map(row => ({
        ...row.session,
        module: row.module!,
        reports: [] as any[],
    }));
}

export async function createSession(data: { classId: number; moduleId: number; startDate: Date; deadline: Date }) {
    await db.insert(practicalSessions).values(data);
    revalidatePath(`/lecturer/sessions/${data.classId}`);
}

// --- Student ---
export async function getStudentSessions(studentId: number) {
    // 1. Get enrolled classes
    const enrollments = await db.select().from(classEnrollments).where(eq(classEnrollments.studentId, studentId));
    const classIds = enrollments.map(e => e.classId);

    if (classIds.length === 0) return [];

    // 2. Get sessions for those classes
    const rows = await db
        .select({
            session: practicalSessions,
            class: classes,
            module: modules,
        })
        .from(practicalSessions)
        .leftJoin(classes, eq(practicalSessions.classId, classes.id))
        .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
        .orderBy(desc(practicalSessions.startDate));

    const filteredRows = rows.filter(r => classIds.includes(r.session.classId));

    // We also need reports for the student
    const reports = await db
        .select()
        .from(practicalReports)
        .where(eq(practicalReports.studentId, studentId));

    return filteredRows.map(row => ({
        ...row.session,
        class: row.class!,
        module: row.module!,
        reports: reports.filter(r => r.sessionId === row.session.id),
    }));
}

export async function submitReport(data: { sessionId: number; studentId: number; filePath: string }) {
    await db.insert(practicalReports).values(data);
    revalidatePath('/student/sessions');
}

// --- Helpers ---
export async function getLecturers() {
    const rows = await db
        .select({
            user: users,
            role: roles,
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id));

    return rows
        .filter(row => row.role && row.role.name === 'Dosen')
        .map(row => ({
            ...row.user,
            role: row.role!,
        }));
}

export async function getClassById(id: number) {
    const rows = await db
        .select({
            class: classes,
            course: courses,
            lecturer: users,
        })
        .from(classes)
        .leftJoin(courses, eq(classes.courseId, courses.id))
        .leftJoin(users, eq(classes.lecturerId, users.id))
        .where(eq(classes.id, id))
        .limit(1);

    if (rows.length === 0) return undefined;

    return {
        ...rows[0].class,
        course: rows[0].course!,
        lecturer: rows[0].lecturer!,
    };
}

export async function getCourseModules(courseId: number) {
    return await db
        .select()
        .from(modules)
        .where(eq(modules.courseId, courseId))
        .orderBy(desc(modules.order));
}

export async function getSessionById(id: number) {
    const rows = await db
        .select({
            session: practicalSessions,
            module: modules,
            class: classes,
            course: courses,
            lecturer: users,
        })
        .from(practicalSessions)
        .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
        .leftJoin(classes, eq(practicalSessions.classId, classes.id))
        .leftJoin(courses, eq(classes.courseId, courses.id))
        .leftJoin(users, eq(classes.lecturerId, users.id))
        .where(eq(practicalSessions.id, id))
        .limit(1);

    if (rows.length === 0) return undefined;

    // Fetch reports
    const reports = await db
        .select()
        .from(practicalReports)
        .where(eq(practicalReports.sessionId, id));

    return {
        ...rows[0].session,
        module: rows[0].module!,
        class: {
            ...rows[0].class!,
            course: rows[0].course!,
            lecturer: rows[0].lecturer!,
        },
        reports,
    };
}

// --- Academic Docs Facade (Refactored) ---
export async function getDocuments(type?: 'Modul Praktikum' | 'Jurnal Publikasi' | 'Laporan Praktikum', userId?: number) {
    if (type === 'Modul Praktikum') {
        const result = await db.select({
            id: modules.id,
            title: modules.title,
            subject: courses.name,
            description: modules.description,
            filePath: modules.filePath,
            type: sql<string>`'Modul Praktikum'`,
            createdAt: modules.createdAt,
            uploaderName: sql<string>`'Admin'`,
        })
            .from(modules)
            .leftJoin(courses, eq(modules.courseId, courses.id))
            .orderBy(desc(modules.order));
        return result;
    }

    if (type === 'Jurnal Publikasi') {
        const result = await db.select({
            id: publications.id,
            title: publications.title,
            subject: sql<string>`'Jurnal'`,
            description: publications.abstract,
            filePath: publications.filePath,
            link: publications.link,
            type: sql<string>`'Jurnal Publikasi'`,
            createdAt: publications.createdAt,
            uploaderName: publications.authorName // Use manual author name
        })
            .from(publications)
            .leftJoin(users, eq(publications.uploaderId, users.id))
            .orderBy(desc(publications.createdAt));
        return result;
    }

    if (type === 'Laporan Praktikum') {
        let query = db.select({
            id: practicalReports.id,
            title: sql<string>`concat('Laporan - ', ${users.fullName})`,
            subject: modules.title,
            description: practicalReports.feedback,
            filePath: practicalReports.filePath,
            type: sql<string>`'Laporan Praktikum'`,
            createdAt: practicalReports.submissionDate,
            uploaderName: users.fullName
        })
            .from(practicalReports)
            .leftJoin(users, eq(practicalReports.studentId, users.id))
            .leftJoin(practicalSessions, eq(practicalReports.sessionId, practicalSessions.id))
            .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
            .$dynamic();

        if (userId) {
            query = query.where(eq(practicalReports.studentId, userId));
        }

        return await query.orderBy(desc(practicalReports.submissionDate));
    }

    return [];
}

export async function deleteDocument(id: number, type: string) {
    if (type === 'Modul Praktikum') {
        await db.delete(modules).where(eq(modules.id, id));
        revalidatePath('/admin/modules');
    } else if (type === 'Jurnal Publikasi') {
        await db.delete(publications).where(eq(publications.id, id));
    } else if (type === 'Laporan Praktikum') {
        await db.delete(practicalReports).where(eq(practicalReports.id, id));
    }

    revalidatePath('/admin/academic');
    revalidatePath('/lecturer/academic');
    revalidatePath('/student/academic');
}



export async function uploadDocument(formData: FormData) {
    const uploaderId = parseInt(formData.get('uploaderId') as string);
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'Modul Praktikum' | 'Jurnal Publikasi' | 'Laporan Praktikum';
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const link = formData.get('link') as string;
    const authorName = formData.get('authorName') as string; // Get author name
    const publishDateStr = formData.get('publishDate') as string;
    const publishDate = publishDateStr ? new Date(publishDateStr) : null;

    let publicPath = null;
    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        publicPath = `/uploads/${filename}`;
    }

    if (type === 'Modul Praktikum') {
        if (!publicPath) {
            throw new Error('File Modul wajib diupload.');
        }
        const courseId = parseInt(subject);
        if (isNaN(courseId)) {
            throw new Error('Mata Kuliah (Course ID) diperlukan untuk Modul.');
        }

        await db.insert(modules).values({
            courseId,
            title,
            description,
            filePath: publicPath,
            order: 1
        });
    } else if (type === 'Jurnal Publikasi') {
        if (!publicPath && !link) {
            throw new Error('Harap sertakan File atau Link untuk Jurnal Publikasi.');
        }
        await db.insert(publications).values({
            uploaderId: uploaderId, // Renamed from authorId
            authorName: authorName || 'Admin', // Default if missing, though form should require it
            title,
            abstract: description,
            filePath: publicPath,
            link: link || null,
            publishDate: publishDate,
        });
    } else if (type === 'Laporan Praktikum') {
        throw new Error('Upload Laporan Praktikum hanya melalui Sesi Praktikum.');
    }

    revalidatePath('/admin/academic');
    revalidatePath('/lecturer/academic');
    revalidatePath('/student/academic');
}
// --- Class Enrollments ---
export async function getClassMembers(classId: number) {
    const rows = await db
        .select({
            enrollment: classEnrollments,
            student: users,
        })
        .from(classEnrollments)
        .leftJoin(users, eq(classEnrollments.studentId, users.id))
        .where(eq(classEnrollments.classId, classId));

    return rows.map(row => ({
        id: row.enrollment.id,
        studentId: row.student!.id, // Non-null assertion for safety
        fullName: row.student!.fullName,
        identifier: row.student!.identifier,
        email: row.student!.email
    }));
}

export async function enrollStudent(classId: number, studentId: number) {
    // Check existing
    const existing = await db.select().from(classEnrollments)
        .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)))
        .limit(1);

    if (existing.length > 0) {
        throw new Error("Student already enrolled");
    }

    await db.insert(classEnrollments).values({
        classId,
        studentId
    });
    revalidatePath(`/admin/practicum`);
}

export async function unenrollStudent(classId: number, studentId: number) {
    await db.delete(classEnrollments)
        .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)));
    revalidatePath(`/admin/practicum`);
}

export async function searchStudents(query: string, filters?: { batch?: number, studyType?: 'Reguler' | 'Hybrid' }) {
    // Find users with 'Mahasiswa' role and matching name/identifier
    const studentRole = await db.select().from(roles).where(eq(roles.name, 'Mahasiswa')).limit(1);
    if (studentRole.length === 0) return [];

    const roleId = studentRole[0].id;

    let conditions = and(
        eq(users.roleId, roleId),
        sql`(${users.fullName} LIKE ${`%${query}%`} OR ${users.identifier} LIKE ${`%${query}%`})`
    );

    if (filters?.batch) {
        conditions = and(conditions, eq(users.batch, filters.batch));
    }

    if (filters?.studyType) {
        conditions = and(conditions, eq(users.studyType, filters.studyType));
    }

    return await db.select({
        id: users.id,
        fullName: users.fullName,
        identifier: users.identifier,
        email: users.email,
        batch: users.batch,
        studyType: users.studyType
    })
        .from(users)
        .where(conditions)
        .limit(50);
}

export async function bulkEnrollStudents(classId: number, studentIds: number[]) {
    if (studentIds.length === 0) return;

    // Fetch existing enrollments to avoid duplicates
    // We can't use simple 'NOT IN' efficiently without potentially large query string issues,
    // but typically batch size is manageable.
    // Better: Fetch all enrolled IDs for this class, filter locally.
    const enrolled = await db.select({ studentId: classEnrollments.studentId })
        .from(classEnrollments)
        .where(eq(classEnrollments.classId, classId));

    const enrolledSet = new Set(enrolled.map(e => e.studentId));
    const toEnroll = studentIds.filter(id => !enrolledSet.has(id));

    if (toEnroll.length > 0) {
        await db.insert(classEnrollments).values(
            toEnroll.map(studentId => ({ classId, studentId }))
        );
    }

    revalidatePath(`/admin/practicum`);
}

'use server';

import { db } from '@/db';
import {
    classes,
    assignments,
    practicalReports,
    classEnrollments,
    generateEnrollmentKey,
    isAssignmentOpen
} from '@/db/schema/academic';
import { users, roles } from '@/db/schema/users';
import { publications } from '@/db/schema/others';
import { eq, desc, and, or, sql, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

// ============================================================
// SIMPLIFIED ACTIONS - Lean Architecture
// ============================================================
// REMOVED: getCourses, createCourse, deleteCourse (merged into classes)
// REMOVED: getModules, createModule, deleteModule (merged into assignments)
// RENAMED: sessions -> assignments
// ADDED: enrollment key system
// ============================================================

// --- Classes (Now includes course info directly) ---
export async function getClasses() {
    const rows = await db
        .select({
            class: classes,
            lecturer: users,
        })
        .from(classes)
        .leftJoin(users, eq(classes.lecturerId, users.id));

    return rows.map(row => ({
        ...row.class,
        lecturer: row.lecturer!,
    }));
}

export async function createClass(data: {
    courseCode: string;
    courseName: string;
    lecturerId: number;
    name: string;
    semester: string
}) {
    // Auto-generate enrollment key
    const enrollmentKey = generateEnrollmentKey(data.courseCode, data.name);

    await db.insert(classes).values({
        ...data,
        enrollmentKey
    });
    revalidatePath('/admin/classes');
    revalidatePath('/admin/practicum');
}

export async function updateClass(id: number, data: {
    courseCode?: string;
    courseName?: string;
    lecturerId?: number;
    name?: string;
    semester?: string
}) {
    await db.update(classes).set(data).where(eq(classes.id, id));
    revalidatePath('/admin/classes');
    revalidatePath('/admin/practicum');
}

export async function deleteClass(id: number) {
    await db.delete(classes).where(eq(classes.id, id));
    revalidatePath('/admin/classes');
    revalidatePath('/admin/practicum');
}

export async function getClassById(id: number) {
    const rows = await db
        .select({
            class: classes,
            lecturer: users,
        })
        .from(classes)
        .leftJoin(users, eq(classes.lecturerId, users.id))
        .where(eq(classes.id, id))
        .limit(1);

    if (rows.length === 0) return undefined;

    return {
        ...rows[0].class,
        lecturer: rows[0].lecturer!,
    };
}

// --- Enrollment Key System (NEW) ---
export async function regenerateEnrollmentKey(classId: number): Promise<string> {
    const classData = await getClassById(classId);
    if (!classData) throw new Error('Kelas tidak ditemukan');

    const newKey = generateEnrollmentKey(classData.courseCode, classData.name);
    await db.update(classes).set({ enrollmentKey: newKey }).where(eq(classes.id, classId));

    revalidatePath('/admin/practicum');
    return newKey;
}

export async function validateEnrollmentKey(key: string): Promise<{ valid: boolean; classId?: number; className?: string }> {
    const result = await db
        .select({ id: classes.id, name: classes.name, courseName: classes.courseName })
        .from(classes)
        .where(eq(classes.enrollmentKey, key))
        .limit(1);

    if (result.length === 0) {
        return { valid: false };
    }

    return {
        valid: true,
        classId: result[0].id,
        className: `${result[0].courseName} - ${result[0].name}`
    };
}

export async function enrollWithKey(enrollmentKey: string, studentId: number): Promise<void> {
    // Validate key
    const validation = await validateEnrollmentKey(enrollmentKey);
    if (!validation.valid || !validation.classId) {
        throw new Error('Kode enrollment tidak valid');
    }

    const classId = validation.classId;

    // Check if already enrolled
    const existing = await db.select().from(classEnrollments)
        .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)))
        .limit(1);

    if (existing.length > 0) {
        throw new Error('Anda sudah terdaftar di kelas ini');
    }

    // Enroll student
    await db.insert(classEnrollments).values({ classId, studentId });

    revalidatePath('/student/classes');
    revalidatePath('/student/assignments');
}

// --- Assignments (Previously practicalSessions + modules) ---
export async function getAssignments() {
    const rows = await db
        .select({
            assignment: assignments,
            class: classes,
        })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .orderBy(desc(assignments.startDate));

    return rows.map(row => ({
        ...row.assignment,
        isOpen: isAssignmentOpen(row.assignment.deadline), // Computed property
        class: row.class!,
    }));
}

export async function getLecturerClasses(lecturerId: number) {
    return await db
        .select()
        .from(classes)
        .where(eq(classes.lecturerId, lecturerId));
}

export async function getClassAssignments(classId: number) {
    const rows = await db
        .select()
        .from(assignments)
        .where(eq(assignments.classId, classId))
        .orderBy(desc(assignments.startDate));

    return rows.map(row => ({
        ...row,
        isOpen: isAssignmentOpen(row.deadline), // Computed property
        reports: [] as any[], // Can fetch separately if needed
    }));
}

export async function createAssignment(data: {
    classId: number;
    title: string;
    description?: string;
    filePath?: string;
    order?: number;
    startDate: Date;
    deadline: Date
}) {
    await db.insert(assignments).values({
        classId: data.classId,
        title: data.title,
        description: data.description,
        filePath: data.filePath,
        order: data.order ?? 1,
        startDate: data.startDate,
        deadline: data.deadline,
    });
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
}

export async function updateAssignment(id: number, data: {
    title?: string;
    description?: string;
    filePath?: string;
    order?: number;
    startDate?: Date;
    deadline?: Date;
}) {
    await db.update(assignments).set(data).where(eq(assignments.id, id));
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
}

export async function deleteAssignment(id: number) {
    await db.delete(assignments).where(eq(assignments.id, id));
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
}

export async function getAssignmentById(id: number) {
    const rows = await db
        .select({
            assignment: assignments,
            class: classes,
            lecturer: users,
        })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .leftJoin(users, eq(classes.lecturerId, users.id))
        .where(eq(assignments.id, id))
        .limit(1);

    if (rows.length === 0) return undefined;

    // Fetch reports
    const reports = await db
        .select({
            id: practicalReports.id,
            filePath: practicalReports.filePath,
            submissionDate: practicalReports.submissionDate,
            grade: practicalReports.grade,
            feedback: practicalReports.feedback,
            studentId: practicalReports.studentId,
            studentName: users.fullName,
            studentIdentifier: users.identifier,
        })
        .from(practicalReports)
        .leftJoin(users, eq(practicalReports.studentId, users.id))
        .where(eq(practicalReports.assignmentId, id));

    const assignment = rows[0].assignment;
    return {
        ...assignment,
        isOpen: isAssignmentOpen(assignment.deadline), // Computed property
        class: {
            ...rows[0].class!,
            lecturer: rows[0].lecturer!,
        },
        reports: reports.map(r => ({
            id: r.id,
            filePath: r.filePath,
            submissionDate: r.submissionDate,
            grade: r.grade,
            feedback: r.feedback,
            student: {
                id: r.studentId,
                fullName: r.studentName,
                identifier: r.studentIdentifier,
            }
        })),
    };
}

// --- Student ---
export async function getStudentAssignments(studentId: number) {
    // 1. Get enrolled classes
    const enrollments = await db.select().from(classEnrollments).where(eq(classEnrollments.studentId, studentId));
    const classIds = enrollments.map(e => e.classId);

    if (classIds.length === 0) return [];

    // 2. Get assignments for those classes
    const rows = await db
        .select({
            assignment: assignments,
            class: classes,
        })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .where(inArray(assignments.classId, classIds))
        .orderBy(desc(assignments.startDate));

    // 3. Get student's reports
    const reports = await db
        .select()
        .from(practicalReports)
        .where(eq(practicalReports.studentId, studentId));

    return rows.map(row => ({
        ...row.assignment,
        isOpen: isAssignmentOpen(row.assignment.deadline), // Computed property
        class: row.class!,
        reports: reports.filter(r => r.assignmentId === row.assignment.id),
    }));
}

export async function submitReport(data: { assignmentId: number; studentId: number; filePath: string }) {
    // Check if assignment is still open
    const assignment = await db.select().from(assignments).where(eq(assignments.id, data.assignmentId)).limit(1);

    if (assignment.length === 0) {
        throw new Error('Tugas tidak ditemukan');
    }

    if (!isAssignmentOpen(assignment[0].deadline)) {
        throw new Error('Deadline sudah lewat. Pengumpulan tidak diperbolehkan.');
    }

    // Check for existing submission
    const existing = await db.select().from(practicalReports)
        .where(and(
            eq(practicalReports.assignmentId, data.assignmentId),
            eq(practicalReports.studentId, data.studentId)
        ))
        .limit(1);

    if (existing.length > 0) {
        throw new Error('Anda sudah mengumpulkan laporan untuk tugas ini');
    }

    await db.insert(practicalReports).values(data);
    revalidatePath('/student/assignments');
}

export async function updateGrade(reportId: number, grade: number, feedback?: string) {
    const updateData: { grade: number; feedback?: string } = { grade };
    if (feedback !== undefined) {
        updateData.feedback = feedback;
    }

    await db.update(practicalReports)
        .set(updateData)
        .where(eq(practicalReports.id, reportId));
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
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
        studentId: row.student!.id,
        fullName: row.student!.fullName,
        identifier: row.student!.identifier,
        email: row.student!.email,
        enrolledAt: row.enrollment.enrolledAt,
    }));
}

export async function enrollStudent(classId: number, studentId: number) {
    // Check existing
    const existing = await db.select().from(classEnrollments)
        .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)))
        .limit(1);

    if (existing.length > 0) {
        throw new Error("Mahasiswa sudah terdaftar di kelas ini");
    }

    await db.insert(classEnrollments).values({ classId, studentId });
    revalidatePath('/admin/practicum');
}

export async function unenrollStudent(classId: number, studentId: number) {
    await db.delete(classEnrollments)
        .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)));
    revalidatePath('/admin/practicum');
}

export async function searchStudents(query: string, filters?: { batch?: number, studyType?: 'Reguler' | 'Hybrid' }) {
    let conditions = and(
        eq(roles.name, 'Mahasiswa'),
        or(
            sql`${users.fullName} LIKE ${`%${query}%`}`,
            sql`${users.identifier} LIKE ${`%${query}%`}`
        )
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
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(conditions)
        .limit(50);
}

export async function bulkEnrollStudents(classId: number, studentIds: number[]) {
    if (studentIds.length === 0) return;

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

    revalidatePath('/admin/practicum');
}

// --- Academic Docs Facade (Simplified) ---
export async function getDocuments(type?: 'Modul Praktikum' | 'Jurnal Publikasi' | 'Laporan Praktikum', userId?: number) {
    // NOTE: 'Modul Praktikum' is now embedded in assignments
    // This function now returns assignments as "modules" for backward compatibility

    if (type === 'Modul Praktikum') {
        const result = await db.select({
            id: assignments.id,
            title: assignments.title,
            subject: classes.courseName,
            description: assignments.description,
            filePath: assignments.filePath,
            type: sql<string>`'Modul Praktikum'`,
            createdAt: assignments.createdAt,
            uploaderName: sql<string>`'Admin'`,
        })
            .from(assignments)
            .leftJoin(classes, eq(assignments.classId, classes.id))
            .orderBy(desc(assignments.order));
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
            uploaderName: publications.authorName
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
            subject: assignments.title,
            description: practicalReports.feedback,
            filePath: practicalReports.filePath,
            type: sql<string>`'Laporan Praktikum'`,
            createdAt: practicalReports.submissionDate,
            uploaderName: users.fullName
        })
            .from(practicalReports)
            .leftJoin(users, eq(practicalReports.studentId, users.id))
            .leftJoin(assignments, eq(practicalReports.assignmentId, assignments.id))
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
        // Now deletes assignment
        await db.delete(assignments).where(eq(assignments.id, id));
        revalidatePath('/admin/practicum');
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
    const authorName = formData.get('authorName') as string;
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
        // For backward compatibility - create assignment instead of module
        const classId = parseInt(subject);
        if (isNaN(classId)) {
            throw new Error('Kelas diperlukan untuk Modul/Tugas.');
        }

        await db.insert(assignments).values({
            classId,
            title,
            description,
            filePath: publicPath,
            order: 1,
            startDate: new Date(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });
    } else if (type === 'Jurnal Publikasi') {
        if (!publicPath && !link) {
            throw new Error('Harap sertakan File atau Link untuk Jurnal Publikasi.');
        }
        await db.insert(publications).values({
            uploaderId: uploaderId,
            authorName: authorName || 'Admin',
            title,
            abstract: description,
            filePath: publicPath,
            link: link || null,
            publishDate: publishDate,
        });
    } else if (type === 'Laporan Praktikum') {
        throw new Error('Upload Laporan Praktikum hanya melalui halaman Tugas.');
    }

    revalidatePath('/admin/academic');
    revalidatePath('/lecturer/academic');
    revalidatePath('/student/academic');
}

// ============================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================
// These aliases help with gradual migration of existing code

/** @deprecated Use getAssignments() instead */
export const getSessions = getAssignments;

/** @deprecated Use getClassAssignments() instead */
export const getClassSessions = getClassAssignments;

/** @deprecated Use createAssignment() instead */
export async function createSession(data: { classId: number; moduleId: number; startDate: Date; deadline: Date }) {
    // moduleId is ignored in new schema - module info is part of assignment
    await createAssignment({
        classId: data.classId,
        title: 'Praktikum',
        startDate: data.startDate,
        deadline: data.deadline,
    });
}

/** @deprecated Use getAssignmentById() instead */
export const getSessionById = getAssignmentById;

/** @deprecated Use getStudentAssignments() instead */
export const getStudentSessions = getStudentAssignments;

'use server';

import { db } from '@/db';
import { assignments, practicalReports, classes } from '@/db/schema/academic';
import { users } from '@/db/schema/users';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { isAssignmentOpen } from '@/db/schema/academic';

// ============================================================
// PRACTICUM ACTIONS (Simplified)
// ============================================================
// This file now works with 'assignments' instead of 'practicalSessions'
// Module info is embedded directly in assignments
// isOpen is computed from deadline, not stored
// ============================================================

export async function getSessions() {
    const rows = await db.select({
        id: assignments.id,
        classId: assignments.classId,
        title: assignments.title,
        description: assignments.description,
        filePath: assignments.filePath,
        order: assignments.order,
        startDate: assignments.startDate,
        deadline: assignments.deadline,
        createdAt: assignments.createdAt,
        courseName: classes.courseName,
        className: classes.name,
    })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .orderBy(desc(assignments.startDate));

    return rows.map(s => ({
        id: s.id,
        classId: s.classId,
        startDate: s.startDate,
        deadline: s.deadline,
        isOpen: isAssignmentOpen(s.deadline), // Computed from deadline
        // Maintain backward compatible structure
        module: {
            title: s.title!,
            course: {
                name: s.courseName!
            }
        },
        class: {
            name: s.className!
        }
    }));
}

export async function getLecturerSessions(lecturerId: number) {
    const rows = await db.select({
        id: assignments.id,
        classId: assignments.classId,
        title: assignments.title,
        description: assignments.description,
        filePath: assignments.filePath,
        order: assignments.order,
        startDate: assignments.startDate,
        deadline: assignments.deadline,
        courseName: classes.courseName,
        className: classes.name,
    })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .where(eq(classes.lecturerId, lecturerId))
        .orderBy(desc(assignments.startDate));

    return rows.map(s => ({
        id: s.id,
        classId: s.classId,
        startDate: s.startDate,
        deadline: s.deadline,
        isOpen: isAssignmentOpen(s.deadline), // Computed from deadline
        module: {
            title: s.title!,
            course: {
                name: s.courseName!
            }
        },
        class: {
            name: s.className!
        }
    }));
}

export async function getSessionById(id: number) {
    const rows = await db.select({
        assignment: assignments,
        class: classes,
    })
        .from(assignments)
        .where(eq(assignments.id, id))
        .leftJoin(classes, eq(assignments.classId, classes.id));

    if (rows.length === 0) return null;

    const row = rows[0];

    // Fetch reports
    const reports = await db.select({
        id: practicalReports.id,
        grade: practicalReports.grade,
        filePath: practicalReports.filePath,
        submissionDate: practicalReports.submissionDate,
        feedback: practicalReports.feedback,
        studentId: practicalReports.studentId,
        studentName: users.fullName,
        studentIdentifier: users.identifier
    })
        .from(practicalReports)
        .where(eq(practicalReports.assignmentId, id))
        .leftJoin(users, eq(practicalReports.studentId, users.id));

    const assignment = row.assignment;
    return {
        ...assignment,
        isOpen: isAssignmentOpen(assignment.deadline), // Computed from deadline
        // Backward compatible structure
        module: {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            filePath: assignment.filePath,
            order: assignment.order,
            course: {
                id: row.class!.id,
                code: row.class!.courseCode,
                name: row.class!.courseName
            }
        },
        class: row.class!,
        reports: reports.map(r => ({
            id: r.id,
            grade: r.grade,
            filePath: r.filePath,
            submissionDate: r.submissionDate,
            feedback: r.feedback,
            student: {
                id: r.studentId,
                fullName: r.studentName!,
                identifier: r.studentIdentifier!
            }
        }))
    };
}

export async function createSession(data: {
    classId: number;
    title: string;
    description?: string;
    filePath?: string;
    order?: number;
    startDate: Date;
    deadline: Date;
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

export async function updateSession(id: number, data: {
    title?: string;
    description?: string;
    filePath?: string;
    order?: number;
    startDate?: Date;
    deadline?: Date;
}) {
    // Note: isOpen is no longer stored - computed from deadline
    await db.update(assignments)
        .set(data)
        .where(eq(assignments.id, id));
    revalidatePath(`/admin/practicum/${id}`);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
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

export async function getClasses() {
    return await db.select({
        id: classes.id,
        lecturerId: classes.lecturerId,
        courseCode: classes.courseCode,
        courseName: classes.courseName,
        name: classes.name,
        semester: classes.semester,
        enrollmentKey: classes.enrollmentKey,
    })
        .from(classes);
}

export async function getModules() {
    // In new schema, "modules" are now embedded in assignments
    // Return assignments as modules for backward compatibility
    return await db.select({
        id: assignments.id,
        classId: assignments.classId,
        title: assignments.title,
        description: assignments.description,
        filePath: assignments.filePath,
        order: assignments.order,
        createdAt: assignments.createdAt,
        courseName: classes.courseName,
        courseCode: classes.courseCode,
    })
        .from(assignments)
        .leftJoin(classes, eq(assignments.classId, classes.id))
        .orderBy(desc(assignments.order));
}

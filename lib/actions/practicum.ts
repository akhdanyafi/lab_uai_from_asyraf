'use server';

import { db } from '@/db';
import { practicalSessions, practicalReports, modules, classes, courses, users } from '@/db/schema';
import { eq, and, desc, lt, lte, gt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSessions() {
    const sessions = await db.select({
        id: practicalSessions.id,
        classId: practicalSessions.classId,
        moduleId: practicalSessions.moduleId,
        startDate: practicalSessions.startDate,
        deadline: practicalSessions.deadline,
        isOpen: practicalSessions.isOpen,
        moduleTitle: modules.title,
        courseName: courses.name,
        className: classes.name,
    })
        .from(practicalSessions)
        .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
        .leftJoin(courses, eq(modules.courseId, courses.id))
        .leftJoin(classes, eq(practicalSessions.classId, classes.id))
        .orderBy(desc(practicalSessions.startDate));

    // Map to expected structure
    return sessions.map(s => ({
        id: s.id,
        classId: s.classId,
        moduleId: s.moduleId,
        startDate: s.startDate,
        deadline: s.deadline,
        isOpen: s.isOpen,
        module: {
            title: s.moduleTitle!,
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
        session: practicalSessions,
        module: modules,
        course: courses,
        class: classes,
    })
        .from(practicalSessions)
        .where(eq(practicalSessions.id, id))
        .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
        .leftJoin(courses, eq(modules.courseId, courses.id))
        .leftJoin(classes, eq(practicalSessions.classId, classes.id));

    if (rows.length === 0) return null;

    const row = rows[0];

    // Fetch reports separately to avoid complex joins if needed, or join them too.
    // For simplicity and avoiding LATERAL, we can fetch reports in a separate query
    const reports = await db.select({
        id: practicalReports.id,
        grade: practicalReports.grade,
        filePath: practicalReports.filePath,
        submissionDate: practicalReports.submissionDate,
        student: {
            fullName: users.fullName,
            identifier: users.identifier
        }
    })
        .from(practicalReports)
        .where(eq(practicalReports.sessionId, id))
        .leftJoin(users, eq(practicalReports.studentId, users.id));

    return {
        ...row.session,
        module: {
            ...row.module!,
            course: row.course!
        },
        class: row.class!,
        reports: reports.map(r => ({
            ...r,
            student: r.student!
        }))
    };
}

export async function createSession(data: {
    classId: number;
    moduleId: number;
    startDate: Date;
    deadline: Date;
}) {
    await db.insert(practicalSessions).values({
        classId: data.classId,
        moduleId: data.moduleId,
        startDate: data.startDate,
        deadline: data.deadline,
        isOpen: true,
    });
    revalidatePath('/admin/practicum');
}

export async function updateSession(id: number, data: {
    startDate?: Date;
    deadline?: Date;
    moduleId?: number;
    isOpen?: boolean;
}) {
    await db.update(practicalSessions)
        .set(data)
        .where(eq(practicalSessions.id, id));
    revalidatePath(`/admin/practicum/${id}`);
    revalidatePath('/admin/practicum');
}

export async function updateGrade(reportId: number, grade: number) {
    await db.update(practicalReports)
        .set({ grade })
        .where(eq(practicalReports.id, reportId));
    revalidatePath('/admin/practicum'); // Revalidate broadly to ensure consistency
}

export async function getClasses() {
    return await db.query.classes.findMany({
        with: {
            course: true
        }
    });
}

export async function getModules() {
    return await db.query.modules.findMany({
        with: {
            course: true
        }
    });
}

import { mysqlTable, int, varchar, text, datetime, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

// ============================================================
// SIMPLIFIED SCHEMA - Lean Architecture
// ============================================================
// Changes from previous schema:
// 1. REMOVED: courses table (merged into classes)
// 2. REMOVED: modules table (merged into assignments)
// 3. REMOVED: isOpen column (use deadline check instead)
// 4. ADDED: enrollmentKey to classes (for self-enrollment)
// 5. RENAMED: practicalSessions -> assignments
// ============================================================

// Classes (Kelas) - Now includes course info directly
export const classes = mysqlTable('classes', {
    id: int('id').autoincrement().primaryKey(),
    lecturerId: int('lecturer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    // Course info (previously in separate courses table)
    courseCode: varchar('course_code', { length: 20 }).notNull(), // e.g., IF123
    courseName: varchar('course_name', { length: 100 }).notNull(), // e.g., Jaringan Komputer
    // Class info
    name: varchar('name', { length: 50 }).notNull(), // e.g., IF-22A
    semester: varchar('semester', { length: 50 }).notNull(), // e.g., Ganjil 2024/2025
    // Enrollment key for self-enrollment
    enrollmentKey: varchar('enrollment_key', { length: 50 }).notNull().unique(), // e.g., WEB-2024-A-X9K2
}, (table) => ({
    lecturerIdx: index('lecturer_idx').on(table.lecturerId),
    courseCodeIdx: index('course_code_idx').on(table.courseCode),
    enrollmentKeyIdx: index('enrollment_key_idx').on(table.enrollmentKey),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
    lecturer: one(users, {
        fields: [classes.lecturerId],
        references: [users.id],
    }),
    enrollments: many(classEnrollments),
    assignments: many(assignments),
}));

// Class Enrollments (Anggota Kelas)
export const classEnrollments = mysqlTable('class_enrollments', {
    id: int('id').autoincrement().primaryKey(),
    classId: int('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    studentId: int('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    enrolledAt: datetime('enrolled_at').default(sql`CURRENT_TIMESTAMP`), // Track when student enrolled
}, (table) => ({
    classIdx: index('class_idx').on(table.classId),
    studentIdx: index('student_idx').on(table.studentId),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
    class: one(classes, {
        fields: [classEnrollments.classId],
        references: [classes.id],
    }),
    student: one(users, {
        fields: [classEnrollments.studentId],
        references: [users.id],
    }),
}));

// Assignments (Tugas Praktikum) - Previously practicalSessions + modules combined
export const assignments = mysqlTable('assignments', {
    id: int('id').autoincrement().primaryKey(),
    classId: int('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    // Module info (previously in separate modules table)
    title: varchar('title', { length: 255 }).notNull(), // e.g., Modul 1 - TCP/IP
    description: text('description'),
    filePath: varchar('file_path', { length: 255 }), // PDF soal (optional, can upload later)
    order: int('order').notNull().default(1), // Sequence number
    // Session timing
    startDate: datetime('start_date').notNull(),
    deadline: datetime('deadline').notNull(),
    // REMOVED: isOpen - Use `NOW() <= deadline` logic instead
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    classIdx: index('class_idx').on(table.classId),
    orderIdx: index('order_idx').on(table.order),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    class: one(classes, {
        fields: [assignments.classId],
        references: [classes.id],
    }),
    reports: many(practicalReports),
}));

// Practical Reports (Laporan Praktikum - Submission)
export const practicalReports = mysqlTable('practical_reports', {
    id: int('id').autoincrement().primaryKey(),
    assignmentId: int('assignment_id').notNull().references(() => assignments.id, { onDelete: 'cascade' }),
    studentId: int('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    filePath: varchar('file_path', { length: 255 }).notNull(),
    submissionDate: datetime('submission_date').default(sql`CURRENT_TIMESTAMP`),
    grade: int('grade'),
    feedback: text('feedback'),
}, (table) => ({
    assignmentIdx: index('assignment_idx').on(table.assignmentId),
    studentIdx: index('student_idx').on(table.studentId),
}));

export const practicalReportsRelations = relations(practicalReports, ({ one }) => ({
    assignment: one(assignments, {
        fields: [practicalReports.assignmentId],
        references: [assignments.id],
    }),
    student: one(users, {
        fields: [practicalReports.studentId],
        references: [users.id],
    }),
}));

// ============================================================
// HELPER FUNCTION - Generate Enrollment Key
// ============================================================
export function generateEnrollmentKey(courseCode: string, className: string): string {
    // Use combination of timestamp and random for uniqueness
    const random = Math.random().toString(36).toUpperCase().slice(2, 6);
    const cleanCourseCode = courseCode.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 4);
    const cleanClassName = className.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 4);
    return `${cleanCourseCode}-${cleanClassName}-${random}`;
}

// ============================================================
// HELPER FUNCTION - Check if Assignment is Open
// ============================================================
export function isAssignmentOpen(deadline: Date): boolean {
    return new Date() <= new Date(deadline);
}

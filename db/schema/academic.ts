import { mysqlTable, int, varchar, text, datetime, boolean, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

// Courses (Mata Kuliah)
export const courses = mysqlTable('courses', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 20 }).notNull().unique(), // e.g., IF123
    name: varchar('name', { length: 100 }).notNull(), // e.g., Jaringan Komputer
    description: text('description'),
});

// Classes (Kelas)
export const classes = mysqlTable('classes', {
    id: int('id').autoincrement().primaryKey(),
    courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    lecturerId: int('lecturer_id').notNull().references(() => users.id, { onDelete: 'cascade' }), // Dosen Pengampu
    name: varchar('name', { length: 50 }).notNull(), // e.g., IF-22A
    semester: varchar('semester', { length: 50 }).notNull(), // e.g., Ganjil 2024/2025
}, (table) => ({
    courseIdx: index('course_idx').on(table.courseId),
    lecturerIdx: index('lecturer_idx').on(table.lecturerId),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
    course: one(courses, {
        fields: [classes.courseId],
        references: [courses.id],
    }),
    lecturer: one(users, {
        fields: [classes.lecturerId],
        references: [users.id],
    }),
    enrollments: many(classEnrollments),
    sessions: many(practicalSessions),
}));

// Class Enrollments (Anggota Kelas)
export const classEnrollments = mysqlTable('class_enrollments', {
    id: int('id').autoincrement().primaryKey(),
    classId: int('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    studentId: int('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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

// Modules (Modul Praktikum - Master Data)
export const modules = mysqlTable('modules', {
    id: int('id').autoincrement().primaryKey(),
    courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(), // e.g., Modul 1 - TCP/IP
    description: text('description'),
    filePath: varchar('file_path', { length: 255 }).notNull(), // Static PDF
    order: int('order').notNull(), // Sequence number
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    courseIdx: index('course_idx').on(table.courseId),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
    sessions: many(practicalSessions),
}));

// Practical Sessions (Sesi Praktikum - Assignment Bridge)
export const practicalSessions = mysqlTable('practical_sessions', {
    id: int('id').autoincrement().primaryKey(),
    classId: int('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    moduleId: int('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
    startDate: datetime('start_date').notNull(),
    deadline: datetime('deadline').notNull(),
    isOpen: boolean('is_open').default(true),
}, (table) => ({
    classIdx: index('class_idx').on(table.classId),
    moduleIdx: index('module_idx').on(table.moduleId),
}));

export const practicalSessionsRelations = relations(practicalSessions, ({ one, many }) => ({
    class: one(classes, {
        fields: [practicalSessions.classId],
        references: [classes.id],
    }),
    module: one(modules, {
        fields: [practicalSessions.moduleId],
        references: [modules.id],
    }),
    reports: many(practicalReports),
}));

// Practical Reports (Laporan Praktikum - Submission)
export const practicalReports = mysqlTable('practical_reports', {
    id: int('id').autoincrement().primaryKey(),
    sessionId: int('session_id').notNull().references(() => practicalSessions.id, { onDelete: 'cascade' }),
    studentId: int('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    filePath: varchar('file_path', { length: 255 }).notNull(),
    submissionDate: datetime('submission_date').default(sql`CURRENT_TIMESTAMP`),
    grade: int('grade'),
    feedback: text('feedback'),
}, (table) => ({
    sessionIdx: index('session_idx').on(table.sessionId),
    studentIdx: index('student_idx').on(table.studentId),
}));

export const practicalReportsRelations = relations(practicalReports, ({ one }) => ({
    session: one(practicalSessions, {
        fields: [practicalReports.sessionId],
        references: [practicalSessions.id],
    }),
    student: one(users, {
        fields: [practicalReports.studentId],
        references: [users.id],
    }),
}));

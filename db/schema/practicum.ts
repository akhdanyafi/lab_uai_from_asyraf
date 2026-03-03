import { mysqlTable, int, varchar, text, datetime, mysqlEnum, index, date } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';
import { rooms } from './bookings';

// ============================================
// Courses (Mata Kuliah)
// ============================================
export const courses = mysqlTable('courses', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 20 }).notNull().unique(),     // e.g. "IF201"
    name: varchar('name', { length: 255 }).notNull(),             // e.g. "Basis Data"
    description: text('description'),
    sks: int('sks').default(3),
    semester: mysqlEnum('semester', ['Ganjil', 'Genap']),           // Ganjil or Genap
    lecturerId: varchar('lecturer_id', { length: 50 }).references(() => users.identifier, { onDelete: 'set null' }), // Dosen pengajar
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    lecturerIdx: index('lecturer_idx').on(table.lecturerId),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    lecturer: one(users, {
        fields: [courses.lecturerId],
        references: [users.identifier],
    }),
    modules: many(practicumModules),
    scheduledPracticums: many(scheduledPracticums),
}));

// ============================================
// Practicum Modules (Modul Praktikum)
// - Linked to a course via courseId
// ============================================
export const practicumModules = mysqlTable('practicum_modules', {
    id: int('id').autoincrement().primaryKey(),
    courseId: int('course_id').references(() => courses.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    filePath: varchar('file_path', { length: 255 }),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at'),
}, (table) => ({
    courseIdx: index('course_idx').on(table.courseId),
}));

export const practicumModulesRelations = relations(practicumModules, ({ one }) => ({
    course: one(courses, {
        fields: [practicumModules.courseId],
        references: [courses.id],
    }),
}));

// ============================================
// Scheduled Practicums (Jadwal Praktikum Terjadwal)
// - Created by Kepala Lab at the start of each semester
// - Blocks room bookings for the scheduled time
// ============================================
export const scheduledPracticums = mysqlTable('scheduled_practicums', {
    id: int('id').autoincrement().primaryKey(),
    courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
    roomId: int('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
    moduleId: int('module_id').references(() => practicumModules.id, { onDelete: 'set null' }), // Modul praktikum
    createdBy: varchar('created_by', { length: 50 }).notNull().references(() => users.identifier, { onDelete: 'cascade' }),
    dayOfWeek: int('day_of_week').notNull(),                       // 0=Senin, 1=Selasa, ..., 6=Minggu (auto-computed from scheduledDate)
    startTime: varchar('start_time', { length: 5 }).notNull(),     // "08:00"
    endTime: varchar('end_time', { length: 5 }).notNull(),         // "10:00"
    scheduledDate: datetime('scheduled_date').notNull(),            // Tanggal praktikum
    status: mysqlEnum('status', ['Aktif', 'Dibatalkan']).default('Aktif'),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    courseIdx: index('sp_course_idx').on(table.courseId),
    roomIdx: index('sp_room_idx').on(table.roomId),
    moduleIdx: index('sp_module_idx').on(table.moduleId),
    createdByIdx: index('sp_created_by_idx').on(table.createdBy),
}));

export const scheduledPracticumsRelations = relations(scheduledPracticums, ({ one }) => ({
    course: one(courses, {
        fields: [scheduledPracticums.courseId],
        references: [courses.id],
    }),
    room: one(rooms, {
        fields: [scheduledPracticums.roomId],
        references: [rooms.id],
    }),
    module: one(practicumModules, {
        fields: [scheduledPracticums.moduleId],
        references: [practicumModules.id],
    }),
    createdByUser: one(users, {
        fields: [scheduledPracticums.createdBy],
        references: [users.identifier],
    }),
}));

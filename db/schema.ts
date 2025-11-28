import { mysqlTable, serial, varchar, text, datetime, int, boolean, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

// Roles
export const roles = mysqlTable('roles', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'Admin', 'Mahasiswa', 'Dosen'
});

// Users
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  identifier: varchar('identifier', { length: 50 }).notNull().unique(), // NIM or NIDN
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  roleIdx: index('role_idx').on(table.roleId),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

// Rooms
export const rooms = mysqlTable('rooms', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  capacity: int('capacity').notNull(),
});

// Item Categories
export const itemCategories = mysqlTable('item_categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});

// Items
export const items = mysqlTable('items', {
  id: int('id').autoincrement().primaryKey(),
  categoryId: int('category_id').notNull().references(() => itemCategories.id, { onDelete: 'restrict' }),
  roomId: int('room_id').notNull().references(() => rooms.id, { onDelete: 'restrict' }), // Location
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  qrCode: varchar('qr_code', { length: 255 }).unique().notNull(),
  status: mysqlEnum('status', ['Tersedia', 'Dipinjam', 'Maintenance']).default('Tersedia'),
}, (table) => ({
  categoryIdx: index('category_idx').on(table.categoryId),
  roomIdx: index('room_idx').on(table.roomId),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(itemCategories, {
    fields: [items.categoryId],
    references: [itemCategories.id],
  }),
  room: one(rooms, {
    fields: [items.roomId],
    references: [rooms.id],
  }),
}));

// Item Loans
export const itemLoans = mysqlTable('item_loans', {
  id: int('id').autoincrement().primaryKey(),
  studentId: int('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId: int('item_id').notNull().references(() => items.id, { onDelete: 'restrict' }),
  validatorId: int('validator_id').references(() => users.id, { onDelete: 'set null' }),
  requestDate: datetime('request_date').default(sql`CURRENT_TIMESTAMP`),
  returnPlanDate: datetime('return_plan_date').notNull(),
  actualReturnDate: datetime('actual_return_date'),
  status: mysqlEnum('status', ['Pending', 'Disetujui', 'Ditolak', 'Selesai', 'Terlambat']).default('Pending'),
}, (table) => ({
  studentIdx: index('student_idx').on(table.studentId),
  itemIdx: index('item_idx').on(table.itemId),
  validatorIdx: index('validator_idx').on(table.validatorId),
}));

export const itemLoansRelations = relations(itemLoans, ({ one }) => ({
  student: one(users, {
    fields: [itemLoans.studentId],
    references: [users.id],
  }),
  item: one(items, {
    fields: [itemLoans.itemId],
    references: [items.id],
  }),
  validator: one(users, {
    fields: [itemLoans.validatorId],
    references: [users.id],
  }),
}));

// Room Bookings
export const roomBookings = mysqlTable('room_bookings', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roomId: int('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  validatorId: int('validator_id').references(() => users.id, { onDelete: 'set null' }),
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  purpose: text('purpose').notNull(),
  status: mysqlEnum('status', ['Pending', 'Disetujui', 'Ditolak']).default('Pending'),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  roomIdx: index('room_idx').on(table.roomId),
  validatorIdx: index('validator_idx').on(table.validatorId),
}));

export const roomBookingsRelations = relations(roomBookings, ({ one }) => ({
  user: one(users, {
    fields: [roomBookings.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [roomBookings.roomId],
    references: [rooms.id],
  }),
  validator: one(users, {
    fields: [roomBookings.validatorId],
    references: [users.id],
  }),
}));

// Governance Docs
export const governanceDocs = mysqlTable('governance_docs', {
  id: int('id').autoincrement().primaryKey(),
  adminId: int('admin_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  coverPath: varchar('cover_path', { length: 255 }),
  type: mysqlEnum('type', ['SOP', 'LPJ Bulanan']).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  adminIdx: index('admin_idx').on(table.adminId),
}));

// Publications (Jurnal Publikasi)
export const publications = mysqlTable('publications', {
  id: int('id').autoincrement().primaryKey(),
  uploaderId: int('uploader_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 255 }).notNull(), // Manual input for author name
  title: varchar('title', { length: 255 }).notNull(),
  abstract: text('abstract'),
  filePath: varchar('file_path', { length: 255 }), // Optional if link is provided
  link: varchar('link', { length: 255 }),
  publishDate: datetime('publish_date'),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uploaderIdx: index('uploader_idx').on(table.uploaderId),
}));

export const publicationsRelations = relations(publications, ({ one }) => ({
  uploader: one(users, {
    fields: [publications.uploaderId],
    references: [users.id],
  }),
}));

// --- Academic Structure ---

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

// Activity Photos (Foto Kegiatan Homepage)
export const heroPhotos = mysqlTable('hero_photos', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  link: text('link'), // Optional link
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});

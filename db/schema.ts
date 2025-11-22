import { mysqlTable, serial, varchar, text, datetime, int, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

// Roles
export const roles = mysqlTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'Admin', 'Mahasiswa', 'Dosen'
});

// Users
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  roleId: int('role_id').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  identifier: varchar('identifier', { length: 50 }).notNull().unique(), // NIM or NIDN
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

// Rooms
export const rooms = mysqlTable('rooms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  capacity: int('capacity').notNull(),
});

// Item Categories
export const itemCategories = mysqlTable('item_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
});

// Items
export const items = mysqlTable('items', {
  id: serial('id').primaryKey(),
  categoryId: int('category_id').notNull(),
  roomId: int('room_id').notNull(), // Location
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  qrCode: varchar('qr_code', { length: 255 }).unique().notNull(),
  status: mysqlEnum('status', ['Tersedia', 'Dipinjam', 'Maintenance']).default('Tersedia'),
});

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
  id: serial('id').primaryKey(),
  studentId: int('student_id').notNull(),
  itemId: int('item_id').notNull(),
  validatorId: int('validator_id'),
  requestDate: datetime('request_date').default(sql`CURRENT_TIMESTAMP`),
  returnPlanDate: datetime('return_plan_date').notNull(),
  actualReturnDate: datetime('actual_return_date'),
  status: mysqlEnum('status', ['Pending', 'Disetujui', 'Ditolak', 'Selesai', 'Terlambat']).default('Pending'),
});

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
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  roomId: int('room_id').notNull(),
  validatorId: int('validator_id'),
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  purpose: text('purpose').notNull(),
  status: mysqlEnum('status', ['Pending', 'Disetujui', 'Ditolak']).default('Pending'),
});

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

// Academic Docs
export const academicDocs = mysqlTable('academic_docs', {
  id: serial('id').primaryKey(),
  uploaderId: int('uploader_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['Modul Praktikum', 'Laporan Praktikum']).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Governance Docs
export const governanceDocs = mysqlTable('governance_docs', {
  id: serial('id').primaryKey(),
  adminId: int('admin_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['SOP', 'LPJ Bulanan']).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Student Publications
export const studentPublications = mysqlTable('student_publications', {
  id: serial('id').primaryKey(),
  studentId: int('student_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  abstract: text('abstract'),
  link: varchar('link', { length: 255 }),
  publishDate: datetime('publish_date'),
});

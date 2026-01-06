import { mysqlTable, int, varchar, datetime, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';
import { rooms } from './bookings';

// Lab Attendance (Absensi Masuk Lab)
export const labAttendance = mysqlTable('lab_attendance', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roomId: int('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
    purpose: varchar('purpose', { length: 255 }).notNull(),
    dosenPenanggungJawab: varchar('dosen_penanggung_jawab', { length: 255 }), // Optional, defaults to user's dosenPembimbing
    checkInTime: datetime('check_in_time').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    userIdx: index('user_idx').on(table.userId),
    roomIdx: index('room_idx').on(table.roomId),
    checkInTimeIdx: index('check_in_time_idx').on(table.checkInTime),
}));

export const labAttendanceRelations = relations(labAttendance, ({ one }) => ({
    user: one(users, {
        fields: [labAttendance.userId],
        references: [users.id],
    }),
    room: one(rooms, {
        fields: [labAttendance.roomId],
        references: [rooms.id],
    }),
}));

import { mysqlTable, int, varchar, text, datetime, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Rooms
export const rooms = mysqlTable('rooms', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    capacity: int('capacity').notNull(),
    status: mysqlEnum('status', ['Tersedia', 'Maintenance']).default('Tersedia'),
});

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

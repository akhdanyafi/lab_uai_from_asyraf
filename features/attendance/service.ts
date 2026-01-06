import { db } from '@/db';
import { labAttendance, users, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Find user by NIM (identifier) with dosenPembimbing for fallback
 */
export async function findUserByNim(nim: string) {
    const result = await db.select({
        id: users.id,
        fullName: users.fullName,
        identifier: users.identifier,
        dosenPembimbing: users.dosenPembimbing,
    })
        .from(users)
        .where(eq(users.identifier, nim))
        .limit(1);

    return result[0] || null;
}

/**
 * Get all available rooms for attendance
 */
export async function getAvailableRooms() {
    const result = await db.select({
        id: rooms.id,
        name: rooms.name,
        location: rooms.location,
    })
        .from(rooms)
        .where(eq(rooms.status, 'Tersedia'));

    return result;
}

/**
 * Create attendance record with room, purpose, and dosen penanggung jawab
 */
export async function createAttendance(
    userId: number,
    roomId: number,
    purpose: string,
    dosenPenanggungJawab: string
) {
    const result = await db.insert(labAttendance).values({
        userId,
        roomId,
        purpose,
        dosenPenanggungJawab,
    });

    return result[0];
}

/**
 * Get attendance with user and room info
 */
export async function getAttendanceWithDetails(userId: number, roomId: number) {
    const result = await db.select({
        id: labAttendance.id,
        userId: labAttendance.userId,
        roomId: labAttendance.roomId,
        purpose: labAttendance.purpose,
        checkInTime: labAttendance.checkInTime,
        user: {
            id: users.id,
            fullName: users.fullName,
            identifier: users.identifier,
        },
        room: {
            id: rooms.id,
            name: rooms.name,
            location: rooms.location,
        }
    })
        .from(labAttendance)
        .innerJoin(users, eq(labAttendance.userId, users.id))
        .innerJoin(rooms, eq(labAttendance.roomId, rooms.id))
        .where(eq(labAttendance.userId, userId))
        .orderBy(labAttendance.checkInTime)
        .limit(1);

    return result[0] || null;
}

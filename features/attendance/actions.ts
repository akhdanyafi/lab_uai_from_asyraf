'use server';

import { findUserByNim, createAttendance, getAvailableRooms } from './service';
import type { CheckInResult } from './types';

/**
 * Get all available rooms for the attendance form
 */
export async function getRooms() {
    return await getAvailableRooms();
}

/**
 * Get all lecturers for the dosen penanggung jawab dropdown
 */
export async function getLecturers() {
    const { db } = await import('@/db');
    const { users, roles } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');

    const lecturers = await db
        .select({
            id: users.id,
            fullName: users.fullName,
        })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(roles.name, 'Dosen'))
        .orderBy(users.fullName);

    return lecturers;
}

/**
 * Check in a user by their NIM with room, purpose, and optional dosen penanggung jawab
 */
export async function checkIn(
    nim: string,
    roomId: number,
    purpose: string,
    dosenPenanggungJawab?: string
): Promise<CheckInResult> {
    try {
        // Validate NIM
        if (!nim || nim.trim() === '') {
            return {
                success: false,
                error: 'NIM tidak boleh kosong',
            };
        }

        // Validate room
        if (!roomId || roomId <= 0) {
            return {
                success: false,
                error: 'Silakan pilih ruangan',
            };
        }

        // Validate purpose
        if (!purpose || purpose.trim() === '') {
            return {
                success: false,
                error: 'Silakan pilih atau masukkan tujuan',
            };
        }

        // Find user by NIM
        const user = await findUserByNim(nim.trim());

        if (!user) {
            return {
                success: false,
                error: 'NIM tidak terdaftar dalam sistem',
            };
        }

        // Use provided dosen or fallback to user's dosenPembimbing
        // If user is a lecturer (Dosen), set to null since they don't have a supervisor
        let finalDosenPenanggungJawab = '-';
        if (user.roleName !== 'Dosen') {
            finalDosenPenanggungJawab = dosenPenanggungJawab?.trim() || user.dosenPembimbing || '-';
        }

        // Create attendance record
        await createAttendance(user.id, roomId, purpose.trim(), finalDosenPenanggungJawab);

        // Get the latest attendance for this user with details
        const attendance = await getLatestAttendanceForUser(user.id);

        return {
            success: true,
            data: attendance,
        };
    } catch (error) {
        console.error('Check-in error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan saat melakukan absen',
        };
    }
}

/**
 * Get the latest attendance record for a user with all details
 */
async function getLatestAttendanceForUser(userId: number) {
    const { db } = await import('@/db');
    const { labAttendance, users, rooms } = await import('@/db/schema');
    const { eq, desc } = await import('drizzle-orm');

    const result = await db.select({
        id: labAttendance.id,
        userId: labAttendance.userId,
        roomId: labAttendance.roomId,
        purpose: labAttendance.purpose,
        dosenPenanggungJawab: labAttendance.dosenPenanggungJawab,
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
        .orderBy(desc(labAttendance.checkInTime))
        .limit(1);

    return result[0] || null;
}

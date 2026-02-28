/**
 * Scheduled Practicum Service
 * Business logic for scheduled practicum management
 */

import { db } from '@/db';
import { scheduledPracticums, courses, practicumModules, users, roomBookings } from '@/db/schema';
import { rooms } from '@/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import type { CreateScheduledPracticumInput, UpdateScheduledPracticumInput } from './types';

export class ScheduledPracticumService {
    /**
     * Get all scheduled practicums with details
     */
    static async getAll(semester?: string) {
        const conditions = [];
        if (semester) {
            conditions.push(eq(scheduledPracticums.semester, semester));
        }

        const query = db
            .select({
                id: scheduledPracticums.id,
                courseId: scheduledPracticums.courseId,
                roomId: scheduledPracticums.roomId,
                moduleId: scheduledPracticums.moduleId,
                createdBy: scheduledPracticums.createdBy,
                semester: scheduledPracticums.semester,
                dayOfWeek: scheduledPracticums.dayOfWeek,
                startTime: scheduledPracticums.startTime,
                endTime: scheduledPracticums.endTime,
                scheduledDate: scheduledPracticums.scheduledDate,
                status: scheduledPracticums.status,
                createdAt: scheduledPracticums.createdAt,
                courseName: courses.name,
                courseCode: courses.code,
                roomName: rooms.name,
                moduleName: practicumModules.name,
                createdByName: users.fullName,
            })
            .from(scheduledPracticums)
            .leftJoin(courses, eq(scheduledPracticums.courseId, courses.id))
            .leftJoin(rooms, eq(scheduledPracticums.roomId, rooms.id))
            .leftJoin(practicumModules, eq(scheduledPracticums.moduleId, practicumModules.id))
            .leftJoin(users, eq(scheduledPracticums.createdBy, users.id))
            .orderBy(scheduledPracticums.scheduledDate, scheduledPracticums.dayOfWeek);

        if (conditions.length > 0) {
            return await (query as any).where(and(...conditions));
        }

        return await query;
    }

    /**
     * Get by ID with details
     */
    static async getById(id: number) {
        const results = await db
            .select({
                id: scheduledPracticums.id,
                courseId: scheduledPracticums.courseId,
                roomId: scheduledPracticums.roomId,
                moduleId: scheduledPracticums.moduleId,
                createdBy: scheduledPracticums.createdBy,
                semester: scheduledPracticums.semester,
                dayOfWeek: scheduledPracticums.dayOfWeek,
                startTime: scheduledPracticums.startTime,
                endTime: scheduledPracticums.endTime,
                scheduledDate: scheduledPracticums.scheduledDate,
                status: scheduledPracticums.status,
                createdAt: scheduledPracticums.createdAt,
                courseName: courses.name,
                courseCode: courses.code,
                roomName: rooms.name,
                moduleName: practicumModules.name,
                createdByName: users.fullName,
            })
            .from(scheduledPracticums)
            .leftJoin(courses, eq(scheduledPracticums.courseId, courses.id))
            .leftJoin(rooms, eq(scheduledPracticums.roomId, rooms.id))
            .leftJoin(practicumModules, eq(scheduledPracticums.moduleId, practicumModules.id))
            .leftJoin(users, eq(scheduledPracticums.createdBy, users.id))
            .where(eq(scheduledPracticums.id, id))
            .limit(1);

        return results[0] || null;
    }

    /**
     * Get scheduled practicums by room (for checking booking conflicts)
     */
    static async getByRoom(roomId: number, semester?: string) {
        const conditions = [
            eq(scheduledPracticums.roomId, roomId),
            eq(scheduledPracticums.status, 'Aktif'),
        ];

        if (semester) {
            conditions.push(eq(scheduledPracticums.semester, semester));
        }

        return await db
            .select({
                id: scheduledPracticums.id,
                courseId: scheduledPracticums.courseId,
                semester: scheduledPracticums.semester,
                dayOfWeek: scheduledPracticums.dayOfWeek,
                startTime: scheduledPracticums.startTime,
                endTime: scheduledPracticums.endTime,
                scheduledDate: scheduledPracticums.scheduledDate,
                status: scheduledPracticums.status,
                courseName: courses.name,
                courseCode: courses.code,
                moduleName: practicumModules.name,
            })
            .from(scheduledPracticums)
            .leftJoin(courses, eq(scheduledPracticums.courseId, courses.id))
            .leftJoin(practicumModules, eq(scheduledPracticums.moduleId, practicumModules.id))
            .where(and(...conditions))
            .orderBy(scheduledPracticums.scheduledDate, scheduledPracticums.dayOfWeek);
    }

    /**
     * Check if a room has a conflict with a scheduled practicum at a given time
     */
    static async hasConflict(
        roomId: number,
        dayOfWeek: number,
        startTime: string,
        endTime: string,
        semester: string,
        scheduledDate: Date,
        excludeId?: number
    ): Promise<boolean> {
        // 1. Check conflict with other scheduled practicums
        const conditions = [
            eq(scheduledPracticums.roomId, roomId),
            eq(scheduledPracticums.dayOfWeek, dayOfWeek),
            eq(scheduledPracticums.semester, semester),
            eq(scheduledPracticums.status, 'Aktif'),
        ];

        const schedules = await db
            .select({
                id: scheduledPracticums.id,
                startTime: scheduledPracticums.startTime,
                endTime: scheduledPracticums.endTime,
            })
            .from(scheduledPracticums)
            .where(and(...conditions));

        const practicumConflict = schedules.some(s => {
            if (excludeId && s.id === excludeId) return false;
            return startTime < s.endTime && endTime > s.startTime;
        });

        if (practicumConflict) return true;

        // 2. Check conflict with approved room bookings on that date
        const startOfDay = new Date(scheduledDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(scheduledDate);
        endOfDay.setHours(23, 59, 59, 999);

        const approvedBookings = await db
            .select({
                id: roomBookings.id,
                startTime: roomBookings.startTime,
                endTime: roomBookings.endTime,
            })
            .from(roomBookings)
            .where(and(
                eq(roomBookings.roomId, roomId),
                eq(roomBookings.status, 'Disetujui'),
                gte(roomBookings.startTime, startOfDay),
                lte(roomBookings.endTime, endOfDay)
            ));

        const bookingConflict = approvedBookings.some(b => {
            const bStart = `${String(new Date(b.startTime).getHours()).padStart(2, '0')}:${String(new Date(b.startTime).getMinutes()).padStart(2, '0')}`;
            const bEnd = `${String(new Date(b.endTime).getHours()).padStart(2, '0')}:${String(new Date(b.endTime).getMinutes()).padStart(2, '0')}`;
            return startTime < bEnd && endTime > bStart;
        });

        return bookingConflict;
    }

    /**
     * Create a new scheduled practicum
     */
    static async create(data: CreateScheduledPracticumInput, createdBy: number) {
        // Check for conflicts first (practicums + approved bookings)
        const hasConflict = await this.hasConflict(
            data.roomId,
            data.dayOfWeek,
            data.startTime,
            data.endTime,
            data.semester,
            data.scheduledDate
        );

        if (hasConflict) {
            throw new Error('Jadwal bentrok dengan praktikum lain atau booking ruangan yang sudah disetujui pada waktu tersebut');
        }

        await db.insert(scheduledPracticums).values({
            courseId: data.courseId,
            roomId: data.roomId,
            moduleId: data.moduleId || null,
            createdBy,
            semester: data.semester,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            scheduledDate: data.scheduledDate,
        });
    }

    /**
     * Update a scheduled practicum
     */
    static async update(id: number, data: UpdateScheduledPracticumInput) {
        const updateData: Record<string, any> = {};

        if (data.courseId !== undefined) updateData.courseId = data.courseId;
        if (data.roomId !== undefined) updateData.roomId = data.roomId;
        if (data.moduleId !== undefined) updateData.moduleId = data.moduleId;
        if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
        if (data.startTime !== undefined) updateData.startTime = data.startTime;
        if (data.endTime !== undefined) updateData.endTime = data.endTime;
        if (data.scheduledDate !== undefined) updateData.scheduledDate = data.scheduledDate;
        if (data.status !== undefined) updateData.status = data.status;

        await db.update(scheduledPracticums).set(updateData).where(eq(scheduledPracticums.id, id));
    }

    /**
     * Delete a scheduled practicum
     */
    static async delete(id: number) {
        await db.delete(scheduledPracticums).where(eq(scheduledPracticums.id, id));
    }

    /**
     * Get all unique semesters from scheduled practicums
     */
    static async getAllSemesters(): Promise<string[]> {
        const results = await db
            .select({ semester: scheduledPracticums.semester })
            .from(scheduledPracticums)
            .groupBy(scheduledPracticums.semester);

        return results.map(r => r.semester).sort();
    }
}

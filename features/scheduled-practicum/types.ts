/**
 * Scheduled Practicum Types
 */

export interface ScheduledPracticum {
    id: number;
    courseId: number;
    roomId: number;
    moduleId: number | null;
    createdBy: string;
    dayOfWeek: number; // 0=Senin, 1=Selasa, ..., 6=Minggu (auto-computed from scheduledDate)
    startTime: string; // "08:00"
    endTime: string;   // "10:00"
    scheduledDate: Date;
    status: 'Aktif' | 'Dibatalkan' | null;
    createdAt: Date | null;
}

export interface ScheduledPracticumWithDetails extends ScheduledPracticum {
    courseName: string | null;
    courseCode: string | null;
    roomName: string | null;
    moduleName: string | null;
    createdByName: string | null;
}

export interface CreateScheduledPracticumInput {
    courseId: number;
    roomId: number;
    moduleId?: number;
    startTime: string;
    endTime: string;
    scheduledDate: Date;
}

export interface UpdateScheduledPracticumInput {
    courseId?: number;
    roomId?: number;
    moduleId?: number | null;
    startTime?: string;
    endTime?: string;
    scheduledDate?: Date;
    status?: 'Aktif' | 'Dibatalkan';
}

// Day names in Indonesian
export const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;

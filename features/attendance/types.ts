export interface AttendanceRecord {
    id: number;
    userId: number;
    roomId: number;
    purpose: string;
    checkInTime: Date | null;
    user?: {
        id: number;
        fullName: string;
        identifier: string; // NIM
    };
    room?: {
        id: number;
        name: string;
        location: string;
    };
}

export interface CheckInResult {
    success: boolean;
    data?: AttendanceRecord;
    error?: string;
}

// Purpose templates for dropdown
export const PURPOSE_TEMPLATES = [
    'Penelitian/Riset',
    'Kegiatan belajar mandiri / kelompok',
    'Rapat HIMA / organisasi',
    'Praktikum atau persiapan tugas',
    'Kehadiran di area laboratorium',
    'Lainnya',
] as const;

export type PurposeTemplate = typeof PURPOSE_TEMPLATES[number];


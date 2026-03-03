export interface AttendanceRecord {
    id: number;
    userId: string;
    roomId: number;
    purpose: string;
    dosenPenanggungJawab?: string | null;
    checkInTime: Date | null;
    user?: {
        identifier: string; // NIM
        fullName: string;
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


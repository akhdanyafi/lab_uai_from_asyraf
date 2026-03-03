/**
 * Course Types
 */

export interface Course {
    id: number;
    code: string;
    name: string;
    description: string | null;
    sks: number | null;
    semester: 'Ganjil' | 'Genap' | null;
    lecturerId: string | null;
    createdAt: Date | null;
}

export interface CourseWithLecturer extends Course {
    lecturerName: string | null;
}

export interface CreateCourseInput {
    code: string;
    name: string;
    description?: string;
    sks?: number;
    semester?: 'Ganjil' | 'Genap';
    lecturerId?: string;
}

export interface UpdateCourseInput {
    code?: string;
    name?: string;
    description?: string;
    sks?: number;
    semester?: 'Ganjil' | 'Genap';
    lecturerId?: string | null;
}

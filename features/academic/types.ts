// Academic & Practicum Types

export interface Course {
    id: number;
    code: string;
    name: string;
    description: string | null;
}

export interface Class {
    id: number;
    courseId: number;
    lecturerId: number;
    name: string;
    semester: string;
}

export interface ClassWithDetails extends Class {
    course: Course;
    lecturer: {
        id: number;
        fullName: string;
    };
}

export interface ClassEnrollment {
    id: number;
    classId: number;
    studentId: number;
}

export interface Module {
    id: number;
    courseId: number;
    title: string;
    description: string | null;
    filePath: string;
    order: number;
    createdAt: Date | null;
}

export interface PracticalSession {
    id: number;
    classId: number;
    moduleId: number;
    startDate: Date;
    deadline: Date;
    isOpen: boolean;
}

export interface SessionWithDetails extends PracticalSession {
    class: ClassWithDetails;
    module: Module;
}

export interface PracticalReport {
    id: number;
    sessionId: number;
    studentId: number;
    filePath: string;
    submissionDate: Date | null;
    grade: number | null;
    feedback: string | null;
}

export interface ReportWithDetails extends PracticalReport {
    student: {
        id: number;
        fullName: string;
        identifier: string;
    };
}

export interface CreateSessionInput {
    classId: number;
    moduleId: number;
    startDate: Date;
    deadline: Date;
}

export interface CreateModuleInput {
    courseId: number;
    title: string;
    description?: string;
    filePath: string;
    order: number;
}

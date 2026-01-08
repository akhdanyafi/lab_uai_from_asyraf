/**
 * Practicum Module Types
 */

export interface PracticumModule {
    id: number;
    name: string;
    description: string | null;
    filePath: string | null;
    subjects: string | null; // JSON string array
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface CreateModuleInput {
    name: string;
    description?: string;
    filePath?: string;
    subjects?: string[]; // Will be converted to JSON
}

export interface UpdateModuleInput {
    name?: string;
    description?: string;
    filePath?: string;
    subjects?: string[];
}

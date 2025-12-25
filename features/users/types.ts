// User Types

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    roleId: number;
    fullName: string;
    identifier: string;
    email: string;
    status: 'Active' | 'Pending' | 'Rejected';
    batch: number | null;
    studyType: 'Reguler' | 'Hybrid' | null;
    createdAt: Date | null;
}

export interface UserWithRole extends User {
    role: Role;
}

export interface CreateUserInput {
    fullName: string;
    identifier: string;
    email: string;
    password: string;
    roleId: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

export interface UpdateUserInput {
    id: number;
    fullName?: string;
    identifier?: string;
    email?: string;
    roleId?: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

export interface RegisterInput {
    fullName: string;
    identifier: string;
    email: string;
    password: string;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

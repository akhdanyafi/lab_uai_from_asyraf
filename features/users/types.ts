// User Types

export interface Role {
    id: number;
    name: string;
}

export interface User {
    roleId: number;
    fullName: string;
    identifier: string;
    email: string;
    status: 'Active' | 'Pending' | 'Rejected' | 'Pre-registered';
    phoneNumber: string | null;
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
    identifier: string;
    fullName?: string;
    email?: string;
    roleId?: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
    status?: 'Active' | 'Pending' | 'Rejected' | 'Pre-registered';
    phoneNumber?: string;
}

export interface RegisterInput {
    fullName: string;
    identifier: string;
    email: string;
    password: string;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

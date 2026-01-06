// Loan Types

export interface Loan {
    id: number;
    studentId: number;
    itemId: number;
    validatorId: number | null;
    requestDate: Date | null;
    returnPlanDate: Date;
    actualReturnDate: Date | null;
    status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Selesai' | 'Terlambat';
    // New fields
    organisasi?: string | null;
    startTime?: Date | null;
    endTime?: Date | null;
    purpose?: string | null;
    suratIzin?: string | null;
    dosenPembimbing?: string | null;
    software?: string | null; // JSON string of selected software
}

export interface LoanWithDetails extends Loan {
    student: {
        id: number;
        fullName: string;
        identifier: string;
    };
    item: {
        id: number;
        name: string;
        category: { name: string };
        room: { name: string };
    };
    validator?: {
        id: number;
        fullName: string;
    };
}

export interface CreateLoanInput {
    studentId: number;
    itemId: number;
    returnPlanDate: Date;
    // New fields
    organisasi?: string;
    startTime?: Date;
    endTime?: Date;
    purpose?: string;
    suratIzin?: string;
    dosenPembimbing?: string;
    software?: string[]; // Array of selected software
}

export interface UpdateLoanStatusInput {
    loanId: number;
    status: 'Disetujui' | 'Ditolak';
    validatorId: number;
}

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
}

export interface UpdateLoanStatusInput {
    loanId: number;
    status: 'Disetujui' | 'Ditolak';
    validatorId: number;
}

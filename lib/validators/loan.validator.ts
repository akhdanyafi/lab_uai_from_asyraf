/**
 * Loan Validators
 * Zod schemas for loan-related input validation
 */

import { z } from 'zod';

export const CreateLoanSchema = z.object({
    studentId: z.number().positive('Student ID harus positif'),
    itemId: z.number().positive('Item ID harus positif'),
    returnPlanDate: z.date().min(new Date(), 'Tanggal pengembalian harus di masa depan'),
});

export const UpdateLoanStatusSchema = z.object({
    loanId: z.number().positive('Loan ID harus positif'),
    status: z.enum(['Disetujui', 'Ditolak']),
    validatorId: z.number().positive('Validator ID harus positif'),
});

// Type exports
export type CreateLoanInput = z.infer<typeof CreateLoanSchema>;
export type UpdateLoanStatusInput = z.infer<typeof UpdateLoanStatusSchema>;

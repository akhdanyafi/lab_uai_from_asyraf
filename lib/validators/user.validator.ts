/**
 * User Validators
 * Zod schemas for user-related input validation
 */

import { z } from 'zod';

export const CreateUserSchema = z.object({
    fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
    identifier: z.string().min(5, 'NIM/NIDN harus minimal 5 karakter'),
    email: z.string().email('Format email tidak valid'),
    passwordHash: z.string().min(6, 'Password harus minimal 6 karakter'),
    roleId: z.number().positive('Role ID harus positif'),
    batch: z.number().optional(),
    studyType: z.enum(['Reguler', 'Hybrid']).optional(),
});

export const UpdateUserSchema = z.object({
    fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
    identifier: z.string().min(5, 'NIM/NIDN harus minimal 5 karakter'),
    email: z.string().email('Format email tidak valid'),
    roleId: z.number().positive('Role ID harus positif'),
    passwordHash: z.string().min(6, 'Password harus minimal 6 karakter').optional(),
    batch: z.number().optional(),
    studyType: z.enum(['Reguler', 'Hybrid']).optional(),
});

export const UpdateProfileSchema = z.object({
    fullName: z.string().min(2).optional(),
    identifier: z.string().min(5).optional(),
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
    newEmail: z.string().email().optional(),
    newPassword: z.string().min(6).optional(),
    confirmNewPassword: z.string().optional(),
}).refine(
    (data) => {
        if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
            return false;
        }
        return true;
    },
    { message: 'Konfirmasi password tidak sesuai', path: ['confirmNewPassword'] }
);

// Type exports
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

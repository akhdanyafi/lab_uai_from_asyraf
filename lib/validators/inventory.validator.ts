/**
 * Inventory Validators
 * Zod schemas for inventory-related input validation
 */

import { z } from 'zod';

// Room validators
export const CreateRoomSchema = z.object({
    name: z.string().min(2, 'Nama ruangan minimal 2 karakter'),
    location: z.string().min(2, 'Lokasi minimal 2 karakter'),
    capacity: z.number().positive('Kapasitas harus positif'),
});

export const UpdateRoomSchema = CreateRoomSchema;

// Category validators
export const CreateCategorySchema = z.object({
    name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
});

export const UpdateCategorySchema = CreateCategorySchema;

// Item validators
export const CreateItemSchema = z.object({
    name: z.string().min(2, 'Nama item minimal 2 karakter'),
    categoryId: z.number().positive('Category ID harus positif'),
    roomId: z.number().positive('Room ID harus positif'),
    description: z.string().optional(),
    qrCode: z.string().min(1, 'QR Code wajib diisi'),
    status: z.enum(['Tersedia', 'Dipinjam', 'Maintenance']),
});

export const UpdateItemSchema = z.object({
    name: z.string().min(2, 'Nama item minimal 2 karakter'),
    categoryId: z.number().positive('Category ID harus positif'),
    roomId: z.number().positive('Room ID harus positif'),
    description: z.string().optional(),
    status: z.enum(['Tersedia', 'Dipinjam', 'Maintenance']),
});

// Type exports
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

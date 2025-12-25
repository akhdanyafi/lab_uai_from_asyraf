/**
 * User Service
 * Business logic for user management
 */

import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, desc, and, ne, or } from 'drizzle-orm';

export interface CreateUserInput {
    fullName: string;
    identifier: string;
    email: string;
    passwordHash: string;
    roleId: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

export interface UpdateUserInput {
    fullName: string;
    identifier: string;
    email: string;
    roleId: number;
    passwordHash?: string;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

export class UserService {
    /**
     * Get all users with role information
     */
    static async getAll() {
        const allUsers = await db
            .select({
                id: users.id,
                fullName: users.fullName,
                identifier: users.identifier,
                email: users.email,
                roleId: users.roleId,
                roleName: roles.name,
                createdAt: users.createdAt,
                batch: users.batch,
                studyType: users.studyType
            })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .orderBy(desc(users.createdAt));

        return allUsers;
    }

    /**
     * Get all roles
     */
    static async getRoles() {
        return await db.select().from(roles);
    }

    /**
     * Create a new user
     */
    static async create(data: CreateUserInput) {
        const existing = await db.query.users.findFirst({
            where: (users, { or, eq }) => or(
                eq(users.identifier, data.identifier),
                eq(users.email, data.email)
            )
        });

        if (existing) {
            throw new Error('NIM/NIDN atau Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
        const userData = { ...data, passwordHash: hashedPassword };

        await db.insert(users).values(userData);
    }

    /**
     * Update an existing user
     */
    static async update(id: number, data: UpdateUserInput) {
        const existing = await db.query.users.findFirst({
            where: (users, { or, eq, and, ne }) => and(
                ne(users.id, id),
                or(
                    eq(users.identifier, data.identifier),
                    eq(users.email, data.email)
                )
            )
        });

        if (existing) {
            throw new Error('NIM/NIDN atau Email sudah digunakan user lain');
        }

        const updateData: any = { ...data };

        if (updateData.passwordHash) {
            updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, 10);
        } else {
            delete updateData.passwordHash;
        }

        await db.update(users).set(updateData).where(eq(users.id, id));
    }

    /**
     * Delete a user
     */
    static async delete(id: number) {
        await db.delete(users).where(eq(users.id, id));
    }

    /**
     * Get pending users
     */
    static async getPending() {
        return await db.select({
            id: users.id,
            fullName: users.fullName,
            identifier: users.identifier,
            email: users.email,
            createdAt: users.createdAt,
            role: roles.name,
        })
            .from(users)
            .innerJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.status, 'Pending'));
    }

    /**
     * Update user status
     */
    static async updateStatus(userId: number, status: 'Active' | 'Rejected') {
        await db.update(users)
            .set({ status })
            .where(eq(users.id, userId));
    }

    /**
     * Get user by ID with role
     */
    static async getById(userId: number) {
        const usersWithRoles = await db
            .select({
                user: users,
                roleName: roles.name,
            })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.id, userId))
            .limit(1);

        return usersWithRoles[0] || null;
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword: string, hashedPassword: string) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Hash password
     */
    static async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    /**
     * Check if identifier is unique (excluding a specific user)
     */
    static async isIdentifierUnique(identifier: string, excludeUserId?: number) {
        const conditions = [eq(users.identifier, identifier)];
        if (excludeUserId) {
            conditions.push(ne(users.id, excludeUserId));
        }

        const existing = await db.query.users.findFirst({
            where: and(...conditions)
        });

        return !existing;
    }

    /**
     * Check if email is unique (excluding a specific user)
     */
    static async isEmailUnique(email: string, excludeUserId?: number) {
        const conditions = [eq(users.email, email)];
        if (excludeUserId) {
            conditions.push(ne(users.id, excludeUserId));
        }

        const existing = await db.query.users.findFirst({
            where: and(...conditions)
        });

        return !existing;
    }
}

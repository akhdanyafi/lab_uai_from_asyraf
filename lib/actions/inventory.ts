'use server';

import { db } from '@/db';
import { rooms, itemCategories, items } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// --- Rooms ---

export async function getRooms() {
    return await db.select().from(rooms).orderBy(desc(rooms.id));
}

export async function createRoom(data: { name: string; location: string; capacity: number }) {
    await db.insert(rooms).values(data);
    revalidatePath('/admin/inventory');
}

export async function updateRoom(id: number, data: { name: string; location: string; capacity: number }) {
    await db.update(rooms).set(data).where(eq(rooms.id, id));
    revalidatePath('/admin/inventory');
}

export async function deleteRoom(id: number) {
    await db.delete(rooms).where(eq(rooms.id, id));
    revalidatePath('/admin/inventory');
}

// --- Categories ---

export async function getCategories() {
    return await db.select().from(itemCategories).orderBy(desc(itemCategories.id));
}

export async function createCategory(data: { name: string }) {
    await db.insert(itemCategories).values(data);
    revalidatePath('/admin/inventory');
}

export async function updateCategory(id: number, data: { name: string }) {
    await db.update(itemCategories).set(data).where(eq(itemCategories.id, id));
    revalidatePath('/admin/inventory');
}

export async function deleteCategory(id: number) {
    await db.delete(itemCategories).where(eq(itemCategories.id, id));
    revalidatePath('/admin/inventory');
}

// --- Items ---

export async function getItems() {
    const itemsRaw = await db
        .select({
            item: items,
            category: itemCategories,
            room: rooms,
        })
        .from(items)
        .leftJoin(itemCategories, eq(items.categoryId, itemCategories.id))
        .leftJoin(rooms, eq(items.roomId, rooms.id))
        .orderBy(desc(items.id));

    return itemsRaw.map(row => ({
        ...row.item,
        category: row.category!,
        room: row.room!,
    }));
}

export async function createItem(data: {
    name: string;
    categoryId: number;
    roomId: number;
    description?: string;
    qrCode: string;
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance'
}) {
    await db.insert(items).values(data);
    revalidatePath('/admin/inventory');
}

export async function updateItem(id: number, data: {
    name: string;
    categoryId: number;
    roomId: number;
    description?: string;
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance'
}) {
    await db.update(items).set(data).where(eq(items.id, id));
    revalidatePath('/admin/inventory');
}

export async function deleteItem(id: number) {
    await db.delete(items).where(eq(items.id, id));
    revalidatePath('/admin/inventory');
}

// Get items under maintenance
export async function getMaintenanceItems() {
    const itemsRaw = await db
        .select({
            item: items,
            room: rooms,
        })
        .from(items)
        .leftJoin(rooms, eq(items.roomId, rooms.id))
        .where(eq(items.status, 'Maintenance'))
        .orderBy(desc(items.id));

    return itemsRaw.map(row => ({
        ...row.item,
        room: row.room!,
    }));
}

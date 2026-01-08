'use server';

import { InventoryService } from './service';
import { revalidatePath } from 'next/cache';

// --- Rooms ---

export async function getRooms() {
    return InventoryService.getRooms();
}

export async function createRoom(data: { name: string; location: string; capacity: number }) {
    await InventoryService.createRoom(data);
    revalidatePath('/admin/inventory');
}

export async function updateRoom(id: number, data: { name: string; location: string; capacity: number }) {
    await InventoryService.updateRoom(id, data);
    revalidatePath('/admin/inventory');
}

export async function deleteRoom(id: number) {
    await InventoryService.deleteRoom(id);
    revalidatePath('/admin/inventory');
}

/**
 * Update room status only (for quick status change)
 */
export async function updateRoomStatus(
    id: number,
    status: 'Tersedia' | 'Maintenance'
) {
    const { db } = await import('@/db');
    const { rooms } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');

    await db.update(rooms)
        .set({ status })
        .where(eq(rooms.id, id));

    revalidatePath('/admin/inventory');
}

// --- Categories ---

export async function getCategories() {
    return InventoryService.getCategories();
}

export async function createCategory(data: { name: string }) {
    await InventoryService.createCategory(data);
    revalidatePath('/admin/inventory');
}

export async function updateCategory(id: number, data: { name: string }) {
    await InventoryService.updateCategory(id, data);
    revalidatePath('/admin/inventory');
}

export async function deleteCategory(id: number) {
    await InventoryService.deleteCategory(id);
    revalidatePath('/admin/inventory');
}

// --- Items ---

export async function getItems() {
    return InventoryService.getItems();
}

export async function createItem(data: {
    name: string;
    categoryId: number;
    roomId: number;
    description?: string;
    qrCode: string;
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance'
}) {
    await InventoryService.createItem(data);
    revalidatePath('/admin/inventory');
}

export async function updateItem(id: number, data: {
    name: string;
    categoryId: number;
    roomId: number;
    description?: string;
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance'
}) {
    await InventoryService.updateItem(id, data);
    revalidatePath('/admin/inventory');
}

export async function deleteItem(id: number) {
    await InventoryService.deleteItem(id);
    revalidatePath('/admin/inventory');
}

/**
 * Update item status only (for quick status change)
 */
export async function updateItemStatus(
    id: number,
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance'
) {
    const { db } = await import('@/db');
    const { items } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');

    await db.update(items)
        .set({ status })
        .where(eq(items.id, id));

    revalidatePath('/admin/inventory');
    revalidatePath('/student/items');
}

export async function getMaintenanceItems() {
    return InventoryService.getMaintenanceItems();
}


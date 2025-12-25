// Inventory Types

export interface ItemCategory {
    id: number;
    name: string;
}

export interface Item {
    id: number;
    categoryId: number;
    roomId: number;
    name: string;
    description: string | null;
    qrCode: string;
    status: 'Tersedia' | 'Dipinjam' | 'Maintenance';
}

export interface ItemWithDetails extends Item {
    category: ItemCategory;
    room: {
        id: number;
        name: string;
    };
}

export interface CreateItemInput {
    categoryId: number;
    roomId: number;
    name: string;
    description?: string;
    qrCode: string;
}

export interface UpdateItemInput {
    id: number;
    categoryId?: number;
    roomId?: number;
    name?: string;
    description?: string;
    status?: 'Tersedia' | 'Dipinjam' | 'Maintenance';
}

export interface CreateCategoryInput {
    name: string;
}

export interface CreateRoomInput {
    name: string;
    location: string;
    capacity: number;
}

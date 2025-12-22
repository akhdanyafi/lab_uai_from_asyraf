import { getCategories, getItems, getRooms } from '@/lib/actions/inventory';
import InventoryManager from './_components/InventoryManager';

export default async function InventoryPage() {
    const [categories, rooms, items] = await Promise.all([
        getCategories(),
        getRooms(),
        getItems()
    ]);

    return (
        <InventoryManager
            categories={categories}
            rooms={rooms}
            items={items}
        />
    );
}

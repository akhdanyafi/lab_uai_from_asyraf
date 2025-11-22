import { getAvailableItems } from '@/lib/actions/loans';
import { getCategories } from '@/lib/actions/inventory';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import { Box } from 'lucide-react';

export default async function BrowseItemsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const [items, categories] = await Promise.all([
        getAvailableItems(),
        getCategories()
    ]);

    return (
        <div>
            <script dangerouslySetInnerHTML={{ __html: `window.__USER_ID__ = ${session.user.id};` }} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pinjam Alat</h1>
                <p className="text-gray-500 text-sm mt-1">Pilih alat yang ingin dipinjam</p>
            </div>

            {/* Filter by Category */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                        Semua
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            {items.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada alat tersedia saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} userId={session.user.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

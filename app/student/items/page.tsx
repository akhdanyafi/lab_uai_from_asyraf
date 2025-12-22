import { getAvailableItems } from '@/lib/actions/loan';
import { getCategories } from '@/lib/actions/inventory';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ItemCard from './_components/ItemCard';
import ItemFilter from './_components/ItemFilter';
import { Box } from 'lucide-react';

export default async function BrowseItemsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const params = await searchParams;
    const categoryId = params.category ? parseInt(params.category) : undefined;

    const [items, categories] = await Promise.all([
        getAvailableItems(categoryId),
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
            <ItemFilter categories={categories} />

            {/* Items Grid */}
            {items.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {categoryId
                            ? 'Tidak ada alat tersedia di kategori ini.'
                            : 'Tidak ada alat tersedia saat ini.'}
                    </p>
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

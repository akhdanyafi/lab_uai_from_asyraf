import { Package, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Item {
    id: number;
    name: string;
    qrCode: string;
    status: string | null;
    category: {
        name: string | null;
    } | null;
}

interface AvailableItemsSectionProps {
    items: Item[];
}

export default function AvailableItemsSection({ items }: AvailableItemsSectionProps) {
    // Group by category
    const byCategory = items.reduce((acc, item) => {
        const cat = item.category?.name || 'Lainnya';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    const categories = Object.entries(byCategory).slice(0, 4);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Alat Tersedia</h2>
                </div>
                <Link
                    href="/login"
                    className="text-sm text-[#0F4C81] hover:underline flex items-center gap-1"
                >
                    Pinjam alat <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Semua alat sedang dipinjam</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map(([category, categoryItems]) => (
                        <div key={category}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                {category}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categoryItems.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                ))}
                                {categoryItems.length > 3 && (
                                    <span className="px-3 py-2 text-gray-400 text-sm">
                                        +{categoryItems.length - 3} lainnya
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

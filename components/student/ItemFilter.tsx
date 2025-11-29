'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface ItemFilterProps {
    categories: Category[];
}

export default function ItemFilter({ categories }: ItemFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        router.push(`/student/items?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg text-[#0F4C81]">
                    <Filter className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Filter Kategori</h3>
                    <p className="text-xs text-gray-500">Tampilkan alat berdasarkan kategori</p>
                </div>
            </div>

            <div className="relative group min-w-[200px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#0F4C81] transition-colors">
                    <Filter className="w-4 h-4" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 text-[#1F2937] text-sm font-medium bg-gray-50 hover:bg-white hover:border-[#0F4C81] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 appearance-none cursor-pointer transition-all outline-none"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

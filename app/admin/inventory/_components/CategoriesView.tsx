'use client';

import { createCategory, deleteCategory } from '@/features/inventory/actions';
import { Plus, Trash2, Tags } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface CategoriesViewProps {
    categories: Category[];
}

export default function CategoriesView({ categories }: CategoriesViewProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div>
            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Tambah Kategori Baru
                </h2>
                <form action={async (formData) => {
                    setIsSubmitting(true);
                    const name = formData.get('name') as string;
                    await createCategory({ name });
                    setIsSubmitting(false);
                    // Reset form manually or use ref if needed, but for now simple is fine
                    const form = document.getElementById('add-category-form') as HTMLFormElement;
                    form?.reset();
                }} id="add-category-form" className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                        <input name="name" required placeholder="Contoh: Laptop, Proyektor, Kabel" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </form>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Tags className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">ID: {category.id}</p>
                                </div>
                            </div>
                            <form action={async () => {
                                if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
                                    await deleteCategory(category.id);
                                }
                            }}>
                                <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                        <Tags className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada kategori. Silahkan tambahkan kategori baru.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

import { getCategories, createCategory, deleteCategory } from '@/lib/actions/inventory';
import { Plus, Trash2, Tags } from 'lucide-react';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori Alat</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola kategori untuk pengelompokan alat</p>
                </div>
            </div>

            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Tambah Kategori Baru
                </h2>
                <form action={async (formData) => {
                    'use server';
                    const name = formData.get('name') as string;
                    await createCategory({ name });
                }} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                        <input name="name" required placeholder="Contoh: Laptop, Proyektor, Kabel" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Simpan
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
                                'use server';
                                await deleteCategory(category.id);
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

import { getItems, createItem, deleteItem, getRooms, getCategories } from '@/lib/actions/inventory';
import { Plus, Trash2, Box, QrCode, MapPin, Tag } from 'lucide-react';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';

export default async function ItemsPage() {
    const [items, rooms, categories] = await Promise.all([
        getItems(),
        getRooms(),
        getCategories()
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Alat</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola inventaris alat laboratorium</p>
                </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Tambah Alat Baru
                </h2>
                <form action={async (formData) => {
                    'use server';
                    const name = formData.get('name') as string;
                    const categoryId = parseInt(formData.get('categoryId') as string);
                    const roomId = parseInt(formData.get('roomId') as string);
                    const description = formData.get('description') as string;

                    // Generate QR code string (using timestamp + random for uniqueness)
                    const qrCode = `ITEM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

                    await createItem({
                        name,
                        categoryId,
                        roomId,
                        description: description || undefined,
                        qrCode,
                        status: 'Tersedia'
                    });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alat</label>
                        <input name="name" required placeholder="Contoh: Macbook Pro M1" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select name="categoryId" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                        <select name="roomId" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Pilih Ruangan</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                        <input name="description" placeholder="Spesifikasi atau catatan" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Simpan Alat
                        </button>
                    </div>
                </form>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nama Alat</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Kategori</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Lokasi</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">QR Code</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Box className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                        <Tag className="w-3 h-3" />
                                        {item.category.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="flex items-center gap-1 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {item.room.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${item.status === 'Tersedia' ? 'bg-green-50 text-green-700' :
                                        item.status === 'Dipinjam' ? 'bg-orange-50 text-orange-700' :
                                            'bg-gray-50 text-gray-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <QRCodeDisplay value={item.qrCode} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <form action={async () => {
                                        'use server';
                                        await deleteItem(item.id);
                                    }}>
                                        <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada data alat. Silahkan tambahkan alat baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

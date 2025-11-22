import { getRooms, createRoom, deleteRoom } from '@/lib/actions/inventory';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function RoomsPage() {
    const rooms = await getRooms();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Ruangan</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola daftar ruangan laboratorium</p>
                </div>

                {/* Add Room Modal Trigger (Simplified as a form for now) */}
                <div className="flex gap-2">
                    {/* In a real app, this would open a modal. For MVP, we'll use a simple form below or inline. 
                For now, let's just show the list and a simple add form at the bottom or top.
            */}
                </div>
            </div>

            {/* Add Room Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Tambah Ruangan Baru
                </h2>
                <form action={async (formData) => {
                    'use server';
                    const name = formData.get('name') as string;
                    const location = formData.get('location') as string;
                    const capacity = parseInt(formData.get('capacity') as string);

                    await createRoom({ name, location, capacity });
                }} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
                        <input name="name" required placeholder="Contoh: Lab RPL" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input name="location" required placeholder="Lantai 3" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                        <input name="capacity" type="number" required placeholder="40" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Simpan
                    </button>
                </form>
            </div>

            {/* Rooms List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nama Ruangan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Lokasi</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Kapasitas</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rooms.map((room) => (
                            <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{room.name}</td>
                                <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {room.location}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{room.capacity} Orang</td>
                                <td className="px-6 py-4 text-right">
                                    <form action={async () => {
                                        'use server';
                                        await deleteRoom(room.id);
                                    }}>
                                        <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {rooms.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada data ruangan. Silahkan tambahkan ruangan baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

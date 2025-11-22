import { getAllRooms, getMyBookings, createRoomBooking } from '@/lib/actions/bookings';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CalendarDays, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function LecturerRoomsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const [rooms, bookings] = await Promise.all([
        getAllRooms(),
        getMyBookings(session.user.id)
    ]);

    const getStatusBadge = (status: string) => {
        const styles = {
            'Pending': 'bg-yellow-50 text-yellow-700',
            'Disetujui': 'bg-green-50 text-green-700',
            'Ditolak': 'bg-red-50 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-700';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Disetujui': return <CheckCircle className="w-4 h-4" />;
            case 'Ditolak': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Ruangan</h1>
                <p className="text-gray-500 text-sm mt-1">Ajukan pemesanan ruangan laboratorium</p>
            </div>

            {/* Booking Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    Buat Booking Baru
                </h2>
                <form action={async (formData) => {
                    'use server';
                    const roomId = parseInt(formData.get('roomId') as string);
                    const date = formData.get('date') as string;
                    const startTime = formData.get('startTime') as string;
                    const endTime = formData.get('endTime') as string;
                    const purpose = formData.get('purpose') as string;

                    const startDateTime = new Date(`${date}T${startTime}`);
                    const endDateTime = new Date(`${date}T${endTime}`);

                    await createRoomBooking({
                        userId: session!.user.id,
                        roomId,
                        startTime: startDateTime,
                        endTime: endDateTime,
                        purpose,
                    });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                        <select name="roomId" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Pilih Ruangan</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name} - {room.location}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                        <input type="time" name="startTime" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                        <input type="time" name="endTime" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
                        <textarea
                            name="purpose"
                            required
                            rows={3}
                            placeholder="Jelaskan keperluan booking ruangan"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Ajukan Booking
                        </button>
                    </div>
                </form>
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Booking Saya</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Ruangan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal & Waktu</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Keperluan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-gray-900">{booking.room.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    <div>{new Date(booking.startTime).toLocaleDateString('id-ID')}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                    {booking.purpose}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.status!)}`}>
                                        {getStatusIcon(booking.status!)}
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada riwayat booking.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

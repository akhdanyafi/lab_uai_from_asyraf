import { getAllRooms, getMyBookings, getMonthBookings, getScheduledPracticumsForCalendar } from '@/features/bookings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import RoomBookingClient from '@/features/bookings/components/RoomBookingClient';

export default async function RoomBookingPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Fetch bookings for current month and next 2 months
    const [rooms, myBookings, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, practicumSchedules] = await Promise.all([
        getAllRooms(),
        getMyBookings(session.user.id),
        getMonthBookings(currentMonth, currentYear),
        getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
        getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
        getScheduledPracticumsForCalendar(),
    ]);

    const calendarBookings = [
        ...currentMonthBookings,
        ...nextMonthBookings,
        ...nextNextMonthBookings
    ];

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

            <RoomBookingClient
                rooms={rooms}
                calendarBookings={calendarBookings}
                practicumSchedules={practicumSchedules}
                userId={session.user.id}
            />

            {/* My Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
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
                        {myBookings.map((booking) => (
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
                        {myBookings.length === 0 && (
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

import { getLecturerDashboard } from '@/features/dashboard/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Calendar, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function LecturerDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const dashboard = await getLecturerDashboard(session.user.id);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Dosen</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Booking Mendatang</h3>
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{dashboard.totalBookings}</p>
                </div>

                {/* Quick Insight */}
                <div className={`p-5 rounded-xl border ${dashboard.totalBookings > 0 ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{dashboard.totalBookings > 0 ? '📅' : '✅'}</span>
                        <div>
                            <p className={`font-medium ${dashboard.totalBookings > 0 ? 'text-blue-800' : 'text-green-800'}`}>
                                {dashboard.totalBookings > 0
                                    ? `Anda memiliki ${dashboard.totalBookings} booking mendatang`
                                    : 'Jadwal Anda kosong'}
                            </p>
                            <p className={`text-sm opacity-80 ${dashboard.totalBookings > 0 ? 'text-blue-800' : 'text-green-800'}`}>
                                {dashboard.totalBookings > 0
                                    ? 'Pastikan hadir tepat waktu'
                                    : 'Anda dapat booking ruangan untuk kegiatan'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Upcoming Bookings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Booking Ruangan Saya</h2>
                        <Link href="/lecturer/rooms" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {dashboard.upcomingBookings.slice(0, 5).map((booking) => (
                            <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-900 text-sm">{booking.room.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {new Date(booking.startTime).toLocaleDateString('id-ID')} •
                                        {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{booking.purpose}</p>
                            </div>
                        ))}
                        {dashboard.upcomingBookings.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Tidak ada booking mendatang</p>
                                <Link href="/lecturer/rooms" className="text-primary text-sm hover:underline mt-2 inline-block">
                                    Book ruangan sekarang
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

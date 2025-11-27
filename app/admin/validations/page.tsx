import { getLoanRequests, updateLoanStatus } from '@/lib/actions/loans';
import { getBookingRequests, updateBookingStatus, getAllRooms, getMonthBookings } from '@/lib/actions/bookings';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Box, User, CheckCircle, XCircle, MapPin } from 'lucide-react';
import CalendarView from '@/components/shared/CalendarView';
import ValidationTabs from '@/components/admin/ValidationTabs';

export default async function AdminValidationsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // --- Data Fetching for Loans ---
    const loans = await getLoanRequests();
    const pendingLoans = loans.filter(l => l.status === 'Pending');

    // --- Data Fetching for Bookings ---
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const [bookings, rooms, currentMonthBookings, nextMonthBookings, nextNextMonthBookings] = await Promise.all([
        getBookingRequests(),
        getAllRooms(),
        getMonthBookings(currentMonth, currentYear),
        getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
        getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
    ]);

    const calendarBookings = [
        ...currentMonthBookings,
        ...nextMonthBookings,
        ...nextNextMonthBookings
    ];

    const pendingBookings = bookings.filter(b => b.status === 'Pending');

    // --- Loans Content ---
    const loansContent = (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">{pendingLoans.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Disetujui</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {loans.filter(l => l.status === 'Disetujui').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Ditolak</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {loans.filter(l => l.status === 'Ditolak').length}
                    </p>
                </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Mahasiswa</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Alat</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Pinjam</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Rencana Kembali</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loans.map((loan) => (
                            <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">{loan.student.fullName}</p>
                                            <p className="text-xs text-gray-500">{loan.student.identifier}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">{loan.item.name}</p>
                                            <p className="text-xs text-gray-500">{loan.item.category.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {new Date(loan.requestDate!).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {new Date(loan.returnPlanDate).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${loan.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                        loan.status === 'Disetujui' ? 'bg-green-50 text-green-700' :
                                            'bg-red-50 text-red-700'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {loan.status === 'Pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <form action={async () => {
                                                'use server';
                                                await updateLoanStatus(loan.id, 'Disetujui', session!.user.id);
                                            }}>
                                                <button className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await updateLoanStatus(loan.id, 'Ditolak', session!.user.id);
                                            }}>
                                                <button className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {loans.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada permintaan peminjaman.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- Rooms Content ---
    const roomsContent = (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">{pendingBookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Disetujui</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {bookings.filter(b => b.status === 'Disetujui').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Ditolak</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {bookings.filter(b => b.status === 'Ditolak').length}
                    </p>
                </div>
            </div>

            <CalendarView
                rooms={rooms}
                bookings={calendarBookings}
                title="Kalender Jadwal Ruangan"
                className="mb-8"
            />

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Pemohon</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Ruangan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal & Waktu</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Keperluan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">{booking.user.fullName}</p>
                                            <p className="text-xs text-gray-500">{booking.user.identifier}</p>
                                        </div>
                                    </div>
                                </td>
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
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                        booking.status === 'Disetujui' ? 'bg-green-50 text-green-700' :
                                            'bg-red-50 text-red-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {booking.status === 'Pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <form action={async () => {
                                                'use server';
                                                await updateBookingStatus(booking.id, 'Disetujui', session!.user.id);
                                            }}>
                                                <button className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await updateBookingStatus(booking.id, 'Ditolak', session!.user.id);
                                            }}>
                                                <button className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada permintaan booking.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Validasi & Persetujuan</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola permintaan peminjaman alat dan penggunaan ruangan</p>
            </div>

            <ValidationTabs
                loansContent={loansContent}
                roomsContent={roomsContent}
            />
        </div>
    );
}

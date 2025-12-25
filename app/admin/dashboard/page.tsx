import { getAdminStats } from '@/features/dashboard/actions';
import { TrendingUp, Package, Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Total Alat</h3>
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{stats.totalItems}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Peminjaman Aktif</h3>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.activeLoans}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Peminjaman</h3>
                        <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-orange-500">{stats.pendingLoans}</p>
                    {stats.pendingLoans > 0 && (
                        <Link href="/admin/loans" className="text-xs text-primary hover:underline mt-2 inline-block">
                            Lihat semua →
                        </Link>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Booking</h3>
                        <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-orange-500">{stats.pendingBookings}</p>
                    {stats.pendingBookings > 0 && (
                        <Link href="/admin/bookings" className="text-xs text-primary hover:underline mt-2 inline-block">
                            Lihat semua →
                        </Link>
                    )}
                </div>
            </div>

            {/* Item Status Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Status Alat</h2>
                <div className="space-y-3">
                    {stats.itemStats.map((stat) => {
                        const total = stats.totalItems;
                        const percentage = ((stat.count / total) * 100).toFixed(1);
                        const color = stat.status === 'Tersedia' ? 'bg-green-500' :
                            stat.status === 'Dipinjam' ? 'bg-orange-500' : 'bg-gray-500';

                        return (
                            <div key={stat.status}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{stat.status}</span>
                                    <span className="text-gray-500">{stat.count} ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Loan Requests */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Permintaan Peminjaman Terbaru</h2>
                        <Link href="/admin/loans" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentLoans.slice(0, 5).map((loan) => (
                            <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{loan.student.fullName}</p>
                                    <p className="text-xs text-gray-500">{loan.item.name}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    loan.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {loan.status}
                                </span>
                            </div>
                        ))}
                        {stats.recentLoans.length === 0 && (
                            <p className="text-center text-gray-500 py-4 text-sm">Belum ada permintaan</p>
                        )}
                    </div>
                </div>

                {/* Recent Room Bookings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Booking Ruangan Terbaru</h2>
                        <Link href="/admin/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentBookings.slice(0, 5).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{booking.user.fullName}</p>
                                    <p className="text-xs text-gray-500" suppressHydrationWarning>
                                        {booking.room.name} • {new Date(booking.startTime).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    booking.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                        {stats.recentBookings.length === 0 && (
                            <p className="text-center text-gray-500 py-4 text-sm">Belum ada booking</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

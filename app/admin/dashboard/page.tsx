import { getAdminStats } from '@/features/dashboard/actions';
import { TrendingUp, Package, Clock, Calendar, ArrowRight, Bell, FileCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { MarkAllReadButton } from './_components/MarkAllReadButton';

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    const totalAutoApproved = stats.autoApprovedLoans.length + stats.autoApprovedBookings.length + stats.autoReturnedLoans.length;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            {/* Auto-Approval Notifications */}
            {totalAutoApproved > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            <h2 className="font-semibold text-blue-900">Notifikasi Auto-Approval</h2>
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{totalAutoApproved}</span>
                        </div>
                        <MarkAllReadButton />
                    </div>
                    <div className="space-y-2">
                        {stats.autoApprovedLoans.slice(0, 5).map((loan) => (
                            <div key={`loan-${loan.id}`} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Peminjaman <span className="text-blue-600">{loan.item?.name}</span> oleh <span className="text-gray-700">{loan.student?.fullName}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">Auto-approved dengan surat izin</p>
                                    </div>
                                </div>
                                {loan.suratIzin && (
                                    <a
                                        href={loan.suratIzin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Lihat Surat
                                    </a>
                                )}
                            </div>
                        ))}
                        {stats.autoApprovedBookings.slice(0, 5).map((booking) => (
                            <div key={`booking-${booking.id}`} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Booking <span className="text-blue-600">{booking.room?.name}</span> oleh <span className="text-gray-700">{booking.user?.fullName}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">Auto-approved dengan surat permohonan</p>
                                    </div>
                                </div>
                                {booking.suratPermohonan && (
                                    <a
                                        href={booking.suratPermohonan}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Lihat Surat
                                    </a>
                                )}
                            </div>
                        ))}
                        {/* Auto-returned loans (with photo) */}
                        {stats.autoReturnedLoans.slice(0, 5).map((loan) => (
                            <div key={`return-${loan.id}`} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-400">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Pengembalian <span className="text-green-600">{loan.item?.name}</span> oleh <span className="text-gray-700">{loan.student?.fullName}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">Auto-approved dengan foto bukti pengembalian</p>
                                    </div>
                                </div>
                                {loan.returnPhoto && (
                                    <a
                                        href={loan.returnPhoto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Lihat Foto
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                        <Link href="/admin/validations" className="text-xs text-primary hover:underline mt-2 inline-block">
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
                        <Link href="/admin/validations" className="text-xs text-primary hover:underline mt-2 inline-block">
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
                        <Link href="/admin/validations" className="text-sm text-primary hover:underline flex items-center gap-1">
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
                        <Link href="/admin/validations" className="text-sm text-primary hover:underline flex items-center gap-1">
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


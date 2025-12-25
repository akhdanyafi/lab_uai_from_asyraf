import { getMyLoans, returnItem } from '@/features/loans/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Box, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function MyLoansPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const loans = await getMyLoans(session.user.id);

    const getStatusBadge = (status: string) => {
        const styles = {
            'Pending': 'bg-yellow-50 text-yellow-700',
            'Disetujui': 'bg-green-50 text-green-700',
            'Ditolak': 'bg-red-50 text-red-700',
            'Selesai': 'bg-gray-50 text-gray-700',
            'Terlambat': 'bg-red-50 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-700';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Disetujui': return <CheckCircle className="w-4 h-4" />;
            case 'Ditolak': return <XCircle className="w-4 h-4" />;
            case 'Selesai': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Peminjaman Saya</h1>
                <p className="text-gray-500 text-sm mt-1">Riwayat dan status peminjaman alat</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
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
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Box className="w-5 h-5 text-primary" />
                                        </div>
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
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(loan.status!)}`}>
                                        {getStatusIcon(loan.status!)}
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {loan.status === 'Disetujui' && (
                                        <form action={async () => {
                                            'use server';
                                            await returnItem(loan.id);
                                        }}>
                                            <button className="text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded transition-colors">
                                                Kembalikan
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {loans.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada riwayat peminjaman.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import SearchFilter from '@/components/shared/SearchFilter';
import { Box, User, CheckCircle, XCircle } from 'lucide-react';

interface Loan {
    id: number;
    status: string;
    requestDate: Date | null;
    returnPlanDate: Date;
    student: {
        fullName: string;
        identifier: string;
    };
    item: {
        name: string;
        category: {
            name: string;
        };
    };
}

interface LoansTableWithSearchProps {
    loans: Loan[];
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onReturn: (id: number) => void;
}

export default function LoansTableWithSearch({
    loans,
    onApprove,
    onReject,
    onReturn
}: LoansTableWithSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLoans = useMemo(() => {
        if (!searchQuery) return loans;
        const query = searchQuery.toLowerCase();
        return loans.filter(loan =>
            loan.student.fullName.toLowerCase().includes(query) ||
            loan.student.identifier.toLowerCase().includes(query) ||
            loan.item.name.toLowerCase().includes(query)
        );
    }, [loans, searchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return (
        <div>
            <div className="mb-4">
                <SearchFilter
                    placeholder="Cari nama mahasiswa atau alat..."
                    onSearch={handleSearch}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Mahasiswa</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Alat</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Pinjam</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Rencana Kembali</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLoans.map((loan) => (
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
                                    {loan.requestDate ? new Date(loan.requestDate).toLocaleDateString('id-ID') : '-'}
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
                                <td className="px-6 py-4">
                                    {loan.status === 'Pending' && (
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => onApprove(loan.id)}
                                                className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onReject(loan.id)}
                                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                    {loan.status === 'Disetujui' && (
                                        <button
                                            onClick={() => onReturn(loan.id)}
                                            className="mx-auto flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0F4C81] text-white rounded-lg text-sm hover:bg-[#0F4C81]/90 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Kembalikan
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredLoans.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {searchQuery && (
                <p className="text-sm text-gray-500 mt-2">
                    Menampilkan {filteredLoans.length} dari {loans.length} data
                </p>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Box, MapPin, Tag, Calendar } from 'lucide-react';
import { createLoanRequest } from '@/lib/actions/loans';
import { useRouter } from 'next/navigation';

export default function ItemCard({ item, userId }: { item: any; userId: number }) {
    const [showModal, setShowModal] = useState(false);
    const [returnDate, setReturnDate] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createLoanRequest({
                studentId: userId,
                itemId: item.id,
                returnPlanDate: new Date(returnDate),
            });

            setShowModal(false);
            router.refresh();
            alert('Permintaan peminjaman berhasil dikirim!');
        } catch (error) {
            alert('Gagal mengirim permintaan');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Box className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            {item.description && (
                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span>{item.category.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{item.room.name}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-[#0F4C81] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                    >
                        Ajukan Peminjaman
                    </button>
                </div>
            </div>

            {/* Loan Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Ajukan Peminjaman</h3>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.category.name} • {item.room.name}</p>
                        </div>

                        <form onSubmit={handleRequest}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Tanggal Rencana Pengembalian
                                </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={minDate}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Mengirim...' : 'Kirim Permintaan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

import { getItemByQrCode } from '@/features/inventory/actions';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Box, MapPin, Tag, ArrowLeft, CheckCircle, XCircle, Wrench } from 'lucide-react';

interface Props {
    params: Promise<{ qrCode: string }>;
}

export default async function ItemDetailPage({ params }: Props) {
    const { qrCode } = await params;
    const session = await getSession();
    const item = await getItemByQrCode(qrCode);

    if (!item) {
        notFound();
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Tersedia':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Tersedia
                    </span>
                );
            case 'Dipinjam':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <XCircle className="w-4 h-4" />
                        Sedang Dipinjam
                    </span>
                );
            case 'Maintenance':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                        <Wrench className="w-4 h-4" />
                        Maintenance
                    </span>
                );
            default:
                return null;
        }
    };

    // Build the loan URL with callback
    const loanUrl = session
        ? `/items/${qrCode}/pinjam`
        : `/login?callbackUrl=${encodeURIComponent(`/items/${qrCode}/pinjam`)}`;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-lg mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>

                {/* Item Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a5a96] p-6 text-white">
                        <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <Box className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold mb-1">{item.name}</h1>
                        <p className="text-white/80 text-sm">{item.category.name}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Status */}
                        <div className="flex justify-center">
                            {getStatusBadge(item.status!)}
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Lokasi</p>
                                    <p className="font-medium">{item.room.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Tag className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Kategori</p>
                                    <p className="font-medium">{item.category.name}</p>
                                </div>
                            </div>

                            {item.description && (
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        {item.status === 'Tersedia' ? (
                            <Link
                                href={loanUrl}
                                className="block w-full text-center bg-[#0F4C81] text-white py-3 rounded-xl font-medium hover:bg-[#0F4C81]/90 transition-colors"
                            >
                                Pinjam Alat Ini
                            </Link>
                        ) : (
                            <div className="text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">
                                {item.status === 'Dipinjam' ? 'Alat sedang dipinjam' : 'Alat sedang dalam maintenance'}
                            </div>
                        )}

                        {/* Login hint */}
                        {!session && item.status === 'Tersedia' && (
                            <p className="text-center text-xs text-gray-400">
                                Anda akan diminta login untuk melanjutkan
                            </p>
                        )}
                    </div>
                </div>

                {/* QR Code Info */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Kode: {qrCode}
                </p>
            </div>
        </div>
    );
}

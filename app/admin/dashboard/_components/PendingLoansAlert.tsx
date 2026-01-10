import { Package, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PendingLoansAlertProps {
    pendingCount: number;
}

export default function PendingLoansAlert({ pendingCount }: PendingLoansAlertProps) {
    if (pendingCount === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Permintaan Peminjaman Pending
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
                        </h3>
                        <p className="text-sm text-blue-700 mt-0.5">
                            Ada {pendingCount} permintaan peminjaman yang menunggu validasi
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/validations"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                    Validasi Sekarang
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

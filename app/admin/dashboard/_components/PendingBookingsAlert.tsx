import { CalendarCheck, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PendingBookingsAlertProps {
    pendingCount: number;
}

export default function PendingBookingsAlert({ pendingCount }: PendingBookingsAlertProps) {
    if (pendingCount === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5" />
                            Permintaan Booking Ruangan Pending
                            <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
                        </h3>
                        <p className="text-sm text-purple-700 mt-0.5">
                            Ada {pendingCount} permintaan booking ruangan yang menunggu validasi
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/validations"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                    Validasi Sekarang
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

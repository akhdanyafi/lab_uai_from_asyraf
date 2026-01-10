import { UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PendingUserAlertProps {
    pendingCount: number;
}

export default function PendingUserAlert({ pendingCount }: PendingUserAlertProps) {
    if (pendingCount === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            User Menunggu Validasi
                            <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
                        </h3>
                        <p className="text-sm text-amber-700 mt-0.5">
                            Ada {pendingCount} user yang menunggu validasi akun
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/governance"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                    Validasi Sekarang
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

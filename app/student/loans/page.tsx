import { getMyLoans } from '@/features/loans/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoansTable from './_components/LoansTable';

export default async function MyLoansPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const loans = await getMyLoans(session.user.id);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Peminjaman Saya</h1>
                <p className="text-gray-500 text-sm mt-1">Riwayat dan status peminjaman alat</p>
            </div>

            <LoansTable loans={loans as any} />
        </div>
    );
}


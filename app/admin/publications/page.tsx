import { getPublications, getPendingPublications } from '@/features/publications/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PublicationManager from '@/features/publications/components/PublicationManager';

export default async function AdminPublicationsPage() {
    const session = await getSession();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Dosen')) {
        redirect('/login');
    }

    const allPublications = await getPublications();
    const pendingSubmissions = await getPendingPublications();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Publikasi</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola publikasi dan review pengajuan mahasiswa</p>
            </div>

            <PublicationManager
                publications={allPublications}
                pendingSubmissions={pendingSubmissions}
                userId={session.user.id}
            />
        </div>
    );
}

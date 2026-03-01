import { getPublications } from '@/features/publications/actions';
import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PublicationManager from '@/features/publications/components/PublicationManager';

export default async function LecturerPublicationsPage() {
    const session = await getSession();
    if (!session || !hasPermission(session, 'publications.manage')) {
        redirect('/login');
    }

    const result = await getPublications();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Publikasi</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola dan upload publikasi</p>
            </div>

            <PublicationManager
                publications={result.data}
                userId={session.user.id}
            />
        </div>
    );
}

import { getDocuments } from '@/lib/actions/academic';
import AcademicManager from '@/components/academic/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function AdminPublicationsPage() {
    const session = await getSession();

    // Only fetch publications (Jurnal Publikasi)
    const journals = await getDocuments('Jurnal Publikasi');

    return (
        <AcademicManager
            modules={[]} // Empty as this page is only for publications
            journals={journals}
            reports={[]} // Empty
            userRole="Admin"
            userId={session?.user.id || 0}
            visibleTabs={['journals']}
        />
    );
}

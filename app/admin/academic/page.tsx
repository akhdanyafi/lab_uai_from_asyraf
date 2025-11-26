import { getDocuments } from '@/lib/actions/academic';
import AcademicManager from '@/components/academic/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function AdminAcademicPage() {
    const session = await getSession();

    const [modules, journals, reports] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum')
    ]);

    return (
        <AcademicManager
            modules={modules}
            journals={journals}
            reports={reports}
            userRole="Admin"
            userId={session?.user.id || 0}
        />
    );
}

import { getDocuments } from '@/lib/actions/academic';
import AcademicManager from '@/components/academic/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function StudentAcademicPage() {
    const session = await getSession();

    // Student sees all modules and journals
    // Student sees ONLY their own reports (or maybe all? Requirement says "upload laporan", implies managing own. 
    // Usually students don't see other students' reports. Let's filter by userId for reports.)

    const [modules, journals, reports] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum', session?.user.id)
    ]);

    return (
        <AcademicManager
            modules={modules}
            journals={journals}
            reports={reports}
            userRole="Mahasiswa"
            userId={session?.user.id || 0}
        />
    );
}

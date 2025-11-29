import { getDocuments, getCourses, getClasses, getLecturers } from '@/lib/actions/academic';
import { getSessions } from '@/lib/actions/practicum';
import AcademicManager from '@/components/academic/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function StudentAcademicPage() {
    const session = await getSession();

    const [modules, journals, reports, courses, classes, lecturers, sessions] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum', session?.user.id),
        getCourses(),
        getClasses(),
        getLecturers(),
        getSessions()
    ]);

    return (
        <AcademicManager
            modules={modules}
            journals={journals}
            reports={reports}
            courses={courses}
            classes={classes}
            lecturers={lecturers}
            sessions={sessions}
            userRole="Mahasiswa"
            userId={session?.user.id || 0}
            visibleTabs={['modules', 'journals', 'reports']}
        />
    );
}

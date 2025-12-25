import { getDocuments, getCourses, getClasses, getLecturers } from '@/features/academic/actions';
import { getLecturerSessions } from '@/features/academic/practicum';
import AcademicManager from '@/features/academic/components/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function LecturerAcademicPage() {
    const session = await getSession();

    const [modules, journals, reports, courses, classes, lecturers, sessions] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum'),
        getCourses(),
        getClasses(),
        getLecturers(),
        getLecturerSessions(session?.user.id || 0)
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
            userRole="Dosen"
            userId={session?.user.id || 0}
            visibleTabs={['modules', 'journals', 'courses', 'classes', 'practicum']}
        />
    );
}

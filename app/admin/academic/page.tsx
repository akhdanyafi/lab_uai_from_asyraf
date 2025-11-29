import { getDocuments, getCourses, getClasses, getLecturers } from '@/lib/actions/academic';
import { getSessions } from '@/lib/actions/practicum';
import AcademicManager from '@/components/academic/AcademicManager';
import { getSession } from '@/lib/auth';

export default async function AdminAcademicPage() {
    const session = await getSession();

    const [modules, journals, reports, courses, classes, lecturers, sessions] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum'),
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
            userRole="Admin"
            userId={session?.user.id || 0}
        />
    );
}

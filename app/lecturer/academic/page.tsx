import { getDocuments, getClasses, getLecturers } from '@/features/academic/actions';
import { getLecturerSessions } from '@/features/academic/practicum';
import AcademicManager from '@/features/academic/components/AcademicManager';
import { getSession } from '@/lib/auth';

/**
 * Lecturer Academic Page (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed getCourses() - courses now embedded in classes
 * - 'courses' prop no longer passed to AcademicManager
 */

export default async function LecturerAcademicPage() {
    const session = await getSession();

    const [modules, journals, reports, classes, lecturers, sessions] = await Promise.all([
        getDocuments('Modul Praktikum'),
        getDocuments('Jurnal Publikasi'),
        getDocuments('Laporan Praktikum'),
        getClasses(),
        getLecturers(),
        getLecturerSessions(session?.user.id || 0)
    ]);

    return (
        <AcademicManager
            modules={modules}
            journals={journals}
            reports={reports}
            courses={[]} // Deprecated - no longer used
            classes={classes}
            lecturers={lecturers}
            sessions={sessions}
            userRole="Dosen"
            userId={session?.user.id || 0}
            visibleTabs={['modules', 'journals', 'classes', 'practicum']}
        />
    );
}

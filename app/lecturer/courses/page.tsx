import { getCoursesByLecturerId } from '@/features/courses/actions';
import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CourseManager from '@/features/courses/components/CourseManager';

export default async function LecturerCoursesPage() {
    const session = await getSession();
    if (!session || !hasPermission(session, 'dashboard.lecturer')) redirect('/login');

    const courses = await getCoursesByLecturerId(session.user.identifier);

    return (
        <div>
            {courses.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Mata Kuliah</h2>
                    <p className="text-gray-500">Anda belum memiliki mata kuliah yang dibimbing atau diajar. Silakan hubungi admin.</p>
                </div>
            ) : (
                <CourseManager
                    courses={courses}
                    lecturers={[]}
                    readOnly={true}
                />
            )}
        </div>
    );
}

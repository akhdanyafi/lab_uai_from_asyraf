import { getScheduledPracticumsByLecturerId } from '@/features/scheduled-practicum/actions';
import { getCoursesByLecturerId } from '@/features/courses/actions';
import { getModulesByLecturerId } from '@/features/practicum/actions';
import { getRooms } from '@/features/inventory/actions';
import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ScheduledPracticumManager from '@/features/scheduled-practicum/components/ScheduledPracticumManager';

export default async function LecturerScheduledPracticumPage() {
    const session = await getSession();
    if (!session || !hasPermission(session, 'dashboard.lecturer')) redirect('/login');

    const courses = await getCoursesByLecturerId(session.user.id);

    if (courses.length === 0) {
        return (
            <div>
                <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Mata Kuliah</h2>
                    <p className="text-gray-500">Anda belum memiliki mata kuliah yang dibimbing atau diajar. Jadwal praktikum tidak dapat dikelola.</p>
                </div>
            </div>
        );
    }

    const [schedules, modules, rooms] = await Promise.all([
        getScheduledPracticumsByLecturerId(session.user.id),
        getModulesByLecturerId(session.user.id),
        getRooms()
    ]);

    return (
        <ScheduledPracticumManager
            schedules={schedules}
            courses={courses}
            modules={modules}
            rooms={rooms}
        />
    );
}

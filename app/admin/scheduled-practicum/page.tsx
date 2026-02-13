import { getScheduledPracticums } from '@/features/scheduled-practicum/actions';
import { getCourses } from '@/features/courses/actions';
import { getModules } from '@/features/practicum/actions';
import { getRooms } from '@/features/inventory/actions';
import ScheduledPracticumManager from '@/features/scheduled-practicum/components/ScheduledPracticumManager';

export default async function AdminScheduledPracticumPage() {
    const [schedules, courses, modules, rooms] = await Promise.all([
        getScheduledPracticums(),
        getCourses(),
        getModules(),
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

import { getModules } from '@/features/practicum/actions';
import { getCourses } from '@/features/courses/actions';
import ModuleManager from '@/features/practicum/components/ModuleManager';

export default async function LecturerPracticumPage() {
    const [modules, courses] = await Promise.all([
        getModules(),
        getCourses()
    ]);

    return (
        <ModuleManager modules={modules} courses={courses} />
    );
}

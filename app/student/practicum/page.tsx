import { getModules } from '@/features/practicum/actions';
import { getCourses } from '@/features/courses/actions';
import ModuleList from '@/features/practicum/components/ModuleList';

export default async function StudentPracticumPage() {
    const [modules, courses] = await Promise.all([
        getModules(),
        getCourses()
    ]);

    return (
        <ModuleList modules={modules} courses={courses} />
    );
}

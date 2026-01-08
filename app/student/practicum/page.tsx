import { getModules, getAllSubjects } from '@/features/practicum/actions';
import ModuleList from '@/features/practicum/components/ModuleList';

export default async function StudentPracticumPage() {
    const [modules, subjects] = await Promise.all([
        getModules(),
        getAllSubjects()
    ]);

    return (
        <ModuleList modules={modules} allSubjects={subjects} />
    );
}

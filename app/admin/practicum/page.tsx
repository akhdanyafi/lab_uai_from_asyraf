import { getModules, getAllSubjects } from '@/features/practicum/actions';
import ModuleManager from '@/features/practicum/components/ModuleManager';

export default async function AdminPracticumPage() {
    const [modules, subjects] = await Promise.all([
        getModules(),
        getAllSubjects()
    ]);

    return (
        <ModuleManager modules={modules} allSubjects={subjects} />
    );
}

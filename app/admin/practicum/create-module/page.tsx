import { getCourses } from '@/lib/actions/academic';
import ModuleForm from '@/components/practicum/ModuleForm';

export default async function CreateModulePage() {
    const courses = await getCourses();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Tambah Modul Praktikum</h1>
            <ModuleForm courses={courses} />
        </div>
    );
}

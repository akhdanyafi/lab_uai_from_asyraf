import { getCourses, getLecturers } from '@/lib/actions/academic';
import AcademicForm from '@/components/practicum/AcademicForm';

export default async function CreateAcademicPage() {
    const [courses, lecturers] = await Promise.all([
        getCourses(),
        getLecturers()
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Kelola Data Akademik</h1>
            <p className="text-gray-500">Tambah Mata Kuliah atau Kelas baru.</p>
            <AcademicForm courses={courses} lecturers={lecturers} />
        </div>
    );
}

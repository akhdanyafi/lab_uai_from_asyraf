import { getLecturers } from '@/features/academic/actions';
import AcademicForm from '@/features/academic/components/practicum/AcademicForm';

/**
 * Create Academic Page (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed getCourses() - courses now embedded in classes
 * - AcademicForm only needs lecturers now
 */

export default async function CreateAcademicPage() {
    const lecturers = await getLecturers();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Kelola Data Akademik</h1>
            <p className="text-gray-500">Buat Kelas baru dengan info mata kuliah langsung.</p>
            <AcademicForm lecturers={lecturers} />
        </div>
    );
}

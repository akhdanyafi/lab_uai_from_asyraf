import { getClassById, getClassAssignments, createAssignment } from '@/features/academic/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

/**
 * Lecturer Session Details Page (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed getCourseModules() - modules now embedded in assignments
 * - Uses getClassAssignments() instead of getClassSessions()
 * - Create form now creates assignment directly (title, description, deadline)
 * - No longer needs to select from "Bank Soal"
 */

export default async function LecturerSessionDetailsPage({ params }: { params: Promise<{ classId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { classId } = await params;
    const classIdInt = parseInt(classId);

    const classData = await getClassById(classIdInt);
    if (!classData) notFound();

    // Verify ownership
    if (classData.lecturerId !== session.user.id) {
        return <div className="p-8 text-red-600">Anda tidak memiliki akses ke kelas ini.</div>;
    }

    const classAssignments = await getClassAssignments(classIdInt);

    async function handleCreate(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const startDate = new Date(formData.get('startDate') as string);
        const deadline = new Date(formData.get('deadline') as string);

        await createAssignment({
            classId: classIdInt,
            title,
            description,
            startDate,
            deadline
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{classData.name} - Tugas Praktikum</h1>
                    <p className="text-gray-600">{classData.courseName}</p>
                </div>
                <div className="text-sm text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                        Kode Enroll: {classData.enrollmentKey}
                    </span>
                </div>
            </div>

            {/* Create Form - Now creates assignment directly */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Buat Tugas Baru</h2>
                <form action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
                            <input
                                name="title"
                                required
                                placeholder="Contoh: Praktikum 1 - Pengenalan Jaringan"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                name="description"
                                rows={2}
                                placeholder="Petunjuk pengerjaan..."
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                            <input name="startDate" type="datetime-local" required className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input name="deadline" type="datetime-local" required className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Buat Tugas
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Tugas</th>
                            <th className="p-4 font-medium text-gray-600">Mulai</th>
                            <th className="p-4 font-medium text-gray-600">Deadline</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600">Laporan Masuk</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {classAssignments.map((assignment) => {
                            return (
                                <tr key={assignment.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{assignment.title}</td>
                                    <td className="p-4 text-gray-600">{assignment.startDate.toLocaleString()}</td>
                                    <td className="p-4 text-gray-600">{assignment.deadline.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${assignment.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {assignment.isOpen ? 'Aktif' : 'Tutup'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {assignment.reports?.length || 0} Mahasiswa
                                    </td>
                                </tr>
                            );
                        })}
                        {classAssignments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada tugas praktikum. Buat tugas baru di atas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

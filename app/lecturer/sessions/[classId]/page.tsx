import { getClassById, getClassSessions, getCourseModules, createSession } from '@/lib/actions/academic';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function LecturerSessionDetailsPage({ params }: { params: Promise<{ classId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { classId } = await params;
    const classIdInt = parseInt(classId);

    const [cls, sessions] = await Promise.all([
        getClassById(classIdInt),
        getClassSessions(classIdInt),
        // We need to fetch modules for the course, but we need the courseId first.
        // However, we can't await cls before starting Promise.all if we want full parallelism.
        // But here we depend on cls. So we'll fetch cls first or just chain it.
        // Let's fetch cls first to be safe and simple.
    ]);

    // Re-fetching cls to be safe and simple
    const classData = await getClassById(classIdInt);
    if (!classData) notFound();

    // Verify ownership
    if (classData.lecturerId !== session.user.id) {
        return <div className="p-8 text-red-600">Anda tidak memiliki akses ke kelas ini.</div>;
    }

    const [classSessions, courseModules] = await Promise.all([
        getClassSessions(classIdInt),
        getCourseModules(classData.courseId)
    ]);

    async function handleCreate(formData: FormData) {
        'use server';
        const moduleId = parseInt(formData.get('moduleId') as string);
        const startDate = new Date(formData.get('startDate') as string);
        const deadline = new Date(formData.get('deadline') as string);

        await createSession({ classId: classIdInt, moduleId, startDate, deadline });
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{classData.name} - Sesi Praktikum</h1>
                    <p className="text-gray-600">{classData.course.name}</p>
                </div>
                <div className="text-sm text-gray-500">
                    {classData.semester}
                </div>
            </div>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Buat Sesi Baru</h2>
                <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modul</label>
                        <select name="moduleId" required className="w-full p-2 border rounded-md bg-white">
                            <option value="">Pilih Modul</option>
                            {courseModules.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                        <input name="startDate" type="datetime-local" required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input name="deadline" type="datetime-local" required className="w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Buat Sesi
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Modul</th>
                            <th className="p-4 font-medium text-gray-600">Mulai</th>
                            <th className="p-4 font-medium text-gray-600">Deadline</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600">Laporan Masuk</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {classSessions.map((session) => {
                            const now = new Date();
                            const isOpen = now >= session.startDate && now <= session.deadline;
                            return (
                                <tr key={session.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{session.module.title}</td>
                                    <td className="p-4 text-gray-600">{session.startDate.toLocaleString()}</td>
                                    <td className="p-4 text-gray-600">{session.deadline.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {isOpen ? 'Aktif' : 'Tutup'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {session.reports.length} Mahasiswa
                                    </td>
                                </tr>
                            );
                        })}
                        {classSessions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada sesi praktikum.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

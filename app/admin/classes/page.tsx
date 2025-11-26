import { getClasses, createClass, deleteClass, getCourses, getLecturers } from '@/lib/actions/academic';

export default async function AdminClassesPage() {
    const [classes, courses, lecturers] = await Promise.all([
        getClasses(),
        getCourses(),
        getLecturers()
    ]);

    async function handleCreate(formData: FormData) {
        'use server';
        const courseId = parseInt(formData.get('courseId') as string);
        const lecturerId = parseInt(formData.get('lecturerId') as string);
        const name = formData.get('name') as string;
        const semester = formData.get('semester') as string;

        await createClass({ courseId, lecturerId, name, semester });
    }

    async function handleDelete(id: number) {
        'use server';
        await deleteClass(id);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas</h1>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Tambah Kelas</h2>
                <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <select name="courseId" required className="w-full p-2 border rounded-md bg-white">
                            <option value="">Pilih MK</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosen</label>
                        <select name="lecturerId" required className="w-full p-2 border rounded-md bg-white">
                            <option value="">Pilih Dosen</option>
                            {lecturers.map(l => (
                                <option key={l.id} value={l.id}>{l.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                        <input name="name" required className="w-full p-2 border rounded-md" placeholder="Contoh: IF-22A" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input name="semester" required className="w-full p-2 border rounded-md" placeholder="Contoh: Ganjil 2024/2025" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Tambah
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Kelas</th>
                            <th className="p-4 font-medium text-gray-600">Mata Kuliah</th>
                            <th className="p-4 font-medium text-gray-600">Dosen</th>
                            <th className="p-4 font-medium text-gray-600">Semester</th>
                            <th className="p-4 font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {classes.map((cls) => (
                            <tr key={cls.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{cls.name}</td>
                                <td className="p-4">{cls.course.name} ({cls.course.code})</td>
                                <td className="p-4">{cls.lecturer.fullName}</td>
                                <td className="p-4 text-gray-500">{cls.semester}</td>
                                <td className="p-4">
                                    <form action={handleDelete.bind(null, cls.id)}>
                                        <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {classes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada kelas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

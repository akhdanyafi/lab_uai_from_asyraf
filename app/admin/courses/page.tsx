import { getCourses, createCourse, deleteCourse } from '@/lib/actions/academic';
import { revalidatePath } from 'next/cache';

export default async function AdminCoursesPage() {
    const courses = await getCourses();

    async function handleCreate(formData: FormData) {
        'use server';
        const code = formData.get('code') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        await createCourse({ code, name, description });
    }

    async function handleDelete(id: number) {
        'use server';
        await deleteCourse(id);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Mata Kuliah</h1>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Tambah Mata Kuliah</h2>
                <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode MK</label>
                        <input name="code" required className="w-full p-2 border rounded-md" placeholder="Contoh: IF123" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama MK</label>
                        <input name="name" required className="w-full p-2 border rounded-md" placeholder="Contoh: Jaringan Komputer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <input name="description" className="w-full p-2 border rounded-md" placeholder="Opsional" />
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
                            <th className="p-4 font-medium text-gray-600">Kode</th>
                            <th className="p-4 font-medium text-gray-600">Nama</th>
                            <th className="p-4 font-medium text-gray-600">Deskripsi</th>
                            <th className="p-4 font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50">
                                <td className="p-4">{course.code}</td>
                                <td className="p-4 font-medium">{course.name}</td>
                                <td className="p-4 text-gray-500">{course.description}</td>
                                <td className="p-4">
                                    <form action={handleDelete.bind(null, course.id)}>
                                        <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Belum ada mata kuliah.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

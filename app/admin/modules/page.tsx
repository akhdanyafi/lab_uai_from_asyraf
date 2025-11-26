import { getModules, createModule, deleteModule, getCourses } from '@/lib/actions/academic';

export default async function AdminModulesPage() {
    const [modules, courses] = await Promise.all([
        getModules(),
        getCourses()
    ]);

    async function handleCreate(formData: FormData) {
        'use server';
        const courseId = parseInt(formData.get('courseId') as string);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const filePath = formData.get('filePath') as string;
        const order = parseInt(formData.get('order') as string);

        await createModule({ courseId, title, description, filePath, order });
    }

    async function handleDelete(id: number) {
        'use server';
        await deleteModule(id);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Modul Praktikum</h1>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Tambah Modul</h2>
                <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                        <input name="order" type="number" required className="w-full p-2 border rounded-md" placeholder="1" />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Modul</label>
                        <input name="title" required className="w-full p-2 border rounded-md" placeholder="Contoh: Modul 1" />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link File (PDF)</label>
                        <input name="filePath" required className="w-full p-2 border rounded-md" placeholder="https://..." />
                    </div>
                    <div className="lg:col-span-1">
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
                            <th className="p-4 font-medium text-gray-600">Urutan</th>
                            <th className="p-4 font-medium text-gray-600">Mata Kuliah</th>
                            <th className="p-4 font-medium text-gray-600">Judul</th>
                            <th className="p-4 font-medium text-gray-600">File</th>
                            <th className="p-4 font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {modules.map((mod) => (
                            <tr key={mod.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{mod.order}</td>
                                <td className="p-4">{mod.course.name}</td>
                                <td className="p-4 font-medium">{mod.title}</td>
                                <td className="p-4">
                                    <a href={mod.filePath} target="_blank" className="text-blue-600 hover:underline text-sm">
                                        Lihat PDF
                                    </a>
                                </td>
                                <td className="p-4">
                                    <form action={handleDelete.bind(null, mod.id)}>
                                        <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {modules.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada modul.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

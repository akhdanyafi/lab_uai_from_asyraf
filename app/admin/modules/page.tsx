import { getModules, deleteModule, getCourses, uploadDocument } from '@/lib/actions/academic';
import { Upload } from 'lucide-react';
import { getSession } from '@/lib/auth';

export default async function AdminModulesPage() {
    const session = await getSession();
    const [modules, courses] = await Promise.all([
        getModules(),
        getCourses()
    ]);

    async function handleDelete(id: number) {
        'use server';
        await deleteModule(id, 'Modul Praktikum');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Modul Praktikum</h1>

            {/* Create Form (Upload Style) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Modul Baru
                </h2>
                <form action={uploadDocument} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="hidden" name="uploaderId" value={session?.user.id} />
                    <input type="hidden" name="type" value="Modul Praktikum" />

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Modul</label>
                        <input name="title" required placeholder="Contoh: Modul 1 - Pengenalan Jaringan" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <select name="subject" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Pilih Mata Kuliah</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Modul (PDF)</label>
                        <input type="file" name="file" required accept=".pdf" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                        <textarea name="description" rows={2} placeholder="Keterangan tambahan..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg hover:bg-[#0F4C81]/90 transition-colors font-medium w-full md:w-auto">
                            Upload Modul
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Urutan</th>
                            <th className="p-4 font-semibold text-gray-600">Mata Kuliah</th>
                            <th className="p-4 font-semibold text-gray-600">Judul</th>
                            <th className="p-4 font-semibold text-gray-600">File</th>
                            <th className="p-4 font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {modules.map((mod) => (
                            <tr key={mod.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-500">#{mod.order}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                                        {mod.course.name}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{mod.title}</td>
                                <td className="p-4">
                                    <a href={mod.filePath} target="_blank" className="text-[#0F4C81] hover:underline text-sm font-medium">
                                        Lihat PDF
                                    </a>
                                </td>
                                <td className="p-4">
                                    <form action={handleDelete.bind(null, mod.id)}>
                                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {modules.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada modul yang diupload.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

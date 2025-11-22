import { getAcademicDocs, getGovernanceDocs, uploadAcademicDoc, uploadGovernanceDoc, deleteAcademicDoc, deleteGovernanceDoc } from '@/lib/actions/documents';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FileText, Download, Trash2, Upload } from 'lucide-react';

export default async function AdminDocumentsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const [academicDocs, governanceDocs] = await Promise.all([
        getAcademicDocs(),
        getGovernanceDocs()
    ]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokumen</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola dokumen akademik dan tata kelola</p>
            </div>

            {/* Academic Documents Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Dokumen Akademik</h2>

                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Upload Dokumen Akademik
                    </h3>
                    <form action={async (formData) => {
                        'use server';
                        formData.append('uploaderId', session!.user.id.toString());
                        await uploadAcademicDoc(formData);
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                            <select name="type" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="Modul Praktikum">Modul Praktikum</option>
                                <option value="Laporan Praktikum">Laporan Praktikum</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                            <textarea name="description" rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, max 10MB)</label>
                            <input type="file" name="file" accept=".pdf,.doc,.docx" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Upload Dokumen
                            </button>
                        </div>
                    </form>
                </div>

                {/* Documents List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tipe</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Upload</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {academicDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.title}</p>
                                                {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(doc.createdAt!).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <a href={doc.filePath} download className="text-primary hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <form action={async () => {
                                                'use server';
                                                await deleteAcademicDoc(doc.id);
                                            }}>
                                                <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {academicDocs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada dokumen akademik.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Governance Documents Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Dokumen Tata Kelola</h2>

                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Upload Dokumen Tata Kelola
                    </h3>
                    <form action={async (formData) => {
                        'use server';
                        formData.append('adminId', session!.user.id.toString());
                        await uploadGovernanceDoc(formData);
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                            <select name="type" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="SOP">SOP</option>
                                <option value="LPJ Bulanan">LPJ Bulanan</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, max 10MB)</label>
                            <input type="file" name="file" accept=".pdf,.doc,.docx" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Upload Dokumen
                            </button>
                        </div>
                    </form>
                </div>

                {/* Documents List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tipe</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Upload</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {governanceDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <p className="font-medium text-gray-900">{doc.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(doc.createdAt!).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <a href={doc.filePath} download className="text-primary hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <form action={async () => {
                                                'use server';
                                                await deleteGovernanceDoc(doc.id);
                                            }}>
                                                <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {governanceDocs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada dokumen tata kelola.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

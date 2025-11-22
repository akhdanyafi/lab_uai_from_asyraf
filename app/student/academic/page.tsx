import { getAcademicDocs, uploadAcademicDoc } from '@/lib/actions/documents';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FileText, Download, Upload, BookOpen } from 'lucide-react';

export default async function StudentAcademicPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const docs = await getAcademicDocs();
    const modules = docs.filter(d => d.type === 'Modul Praktikum');
    const myReports = docs.filter(d => d.type === 'Laporan Praktikum' && d.uploaderId === session.user.id);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dokumen Akademik</h1>
                <p className="text-gray-500 text-sm mt-1">Modul praktikum dan laporan</p>
            </div>

            {/* Modules Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Modul Praktikum
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Deskripsi</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {modules.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <p className="font-medium text-gray-900">{doc.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                        {doc.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(doc.createdAt!).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={doc.filePath} download className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {modules.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada modul tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Report Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Laporan Praktikum
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <form action={async (formData) => {
                        'use server';
                        formData.append('uploaderId', session!.user.id.toString());
                        formData.append('type', 'Laporan Praktikum');
                        await uploadAcademicDoc(formData);
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                            <input name="title" required placeholder="Contoh: Laporan Praktikum Basis Data" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, max 10MB)</label>
                            <input type="file" name="file" accept=".pdf" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                            <textarea name="description" rows={2} placeholder="Deskripsi singkat laporan" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Upload Laporan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* My Reports */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Laporan Saya</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Upload</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myReports.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <p className="font-medium text-gray-900">{doc.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(doc.createdAt!).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={doc.filePath} download className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {myReports.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada laporan yang diupload.
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

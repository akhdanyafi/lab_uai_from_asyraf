import { getAcademicDocs } from '@/lib/actions/documents';
import { FileText, Download } from 'lucide-react';

export default async function LecturerReportsPage() {
    const reports = await getAcademicDocs('Laporan Praktikum');

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Laporan Mahasiswa</h1>
                <p className="text-gray-500 text-sm mt-1">Lihat dan download laporan praktikum mahasiswa</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Judul Laporan</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Deskripsi</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Upload</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        <p className="font-medium text-gray-900">{report.title}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                    {report.description || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {new Date(report.createdAt!).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href={report.filePath} download className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada laporan mahasiswa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

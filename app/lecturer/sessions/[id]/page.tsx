import { getSessionById, updateGrade } from '@/lib/actions/practicum';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Download, Calendar, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

export default async function LecturerSessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id: sessionIdStr } = await params;
    const sessionId = parseInt(sessionIdStr);

    const sessionData = await getSessionById(sessionId);
    if (!sessionData) notFound();

    const now = new Date();
    const isOpen = sessionData.isOpen && now >= sessionData.startDate && now <= sessionData.deadline;

    const getStatus = () => {
        if (!sessionData.isOpen) return { label: 'Ditutup', color: 'bg-red-100 text-red-700', icon: XCircle };
        if (now > sessionData.deadline) return { label: 'Selesai', color: 'bg-gray-100 text-gray-700', icon: CheckCircle };
        if (now < sessionData.startDate) return { label: 'Belum Mulai', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
        return { label: 'Sedang Berjalan', color: 'bg-green-100 text-green-700', icon: PlayCircle };
    };

    const status = getStatus();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{sessionData.module.title}</h1>
                    <p className="text-gray-600">{sessionData.module.course.name} - {sessionData.class.name}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                    <status.icon className="w-4 h-4" />
                    {status.label}
                </span>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Waktu Mulai</p>
                        <p className="font-medium">{format(sessionData.startDate, 'dd MMMM yyyy HH:mm', { locale: id })}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Deadline</p>
                        <p className="font-medium">{format(sessionData.deadline, 'dd MMMM yyyy HH:mm', { locale: id })}</p>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Laporan Mahasiswa</h3>
                    <span className="text-sm text-gray-500">Total: {sessionData.reports.length}</span>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Mahasiswa</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Upload</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nilai</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sessionData.reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{report.student.fullName}</div>
                                    <div className="text-xs text-gray-500">{report.student.identifier}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {format(report.submissionDate!, 'dd MMM yyyy HH:mm', { locale: id })}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {report.grade !== null ? (
                                        <span className="font-bold text-gray-900">{report.grade}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Belum dinilai</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <a href={report.filePath} download className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {sessionData.reports.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada mahasiswa yang mengumpulkan laporan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

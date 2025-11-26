import { getSessionById, submitReport } from '@/lib/actions/academic';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';

export default async function StudentSessionDetailsPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { sessionId } = await params;
    const sessionIdInt = parseInt(sessionId);

    const sessionData = await getSessionById(sessionIdInt);
    if (!sessionData) notFound();

    const now = new Date();
    const isOpen = now >= sessionData.startDate && now <= sessionData.deadline;
    // Check if student has submitted
    const existingReport = sessionData.reports.find(r => r.studentId === session.user.id);

    async function handleSubmit(formData: FormData) {
        'use server';
        const filePath = formData.get('filePath') as string;

        await submitReport({
            sessionId: sessionIdInt,
            studentId: session.user.id,
            filePath
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{sessionData.module.title}</h1>
                    <p className="text-gray-600">{sessionData.class.name} - {sessionData.class.course.name}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isOpen ? 'Sesi Aktif' : 'Sesi Ditutup'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Deadline: {sessionData.deadline.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Module Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4">Materi Modul</h2>
                        <p className="text-gray-600 mb-4">{sessionData.module.description || "Tidak ada deskripsi."}</p>
                        <a
                            href={sessionData.module.filePath}
                            target="_blank"
                            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF Modul
                        </a>
                    </div>
                </div>

                {/* Submission Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4">Pengumpulan Laporan</h2>

                        {existingReport ? (
                            <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                <div className="flex items-center text-green-700 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium">Laporan Terkirim</span>
                                </div>
                                <p className="text-sm text-green-600 mb-2">Dikirim pada: {existingReport.submissionDate?.toLocaleString()}</p>
                                <a href={existingReport.filePath} target="_blank" className="text-sm text-blue-600 hover:underline">
                                    Lihat File Saya
                                </a>
                                {existingReport.grade && (
                                    <div className="mt-4 pt-4 border-t border-green-200">
                                        <p className="text-sm font-medium text-gray-700">Nilai: {existingReport.grade}</p>
                                        <p className="text-sm text-gray-600">{existingReport.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ) : isOpen ? (
                            <form action={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link File Laporan (PDF)</label>
                                    <input
                                        name="filePath"
                                        required
                                        className="w-full p-2 border rounded-md"
                                        placeholder="https://..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload file Anda ke cloud storage (Google Drive, dll) dan tempel linknya di sini.
                                    </p>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Kirim Laporan
                                </button>
                            </form>
                        ) : (
                            <div className="bg-red-50 p-4 rounded-md border border-red-100 text-red-700 text-sm">
                                Maaf, sesi pengumpulan laporan sudah ditutup.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

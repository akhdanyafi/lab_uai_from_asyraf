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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{sessionData.module.title}</h1>
                    <p className="text-gray-500 mt-1">{sessionData.class.name} - {sessionData.class.course.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isOpen ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {isOpen ? 'Sesi Aktif' : 'Sesi Ditutup'}
                    </span>
                    <div className="text-right text-sm">
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Batas Waktu</p>
                        <p className="text-gray-900 font-medium">{sessionData.deadline.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Module Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Materi Modul
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                            <p>{sessionData.module.description || "Tidak ada deskripsi untuk modul ini."}</p>
                        </div>

                        <div className="border-t border-gray-50 pt-4">
                            <a
                                href={sessionData.module.filePath}
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PDF Modul
                            </a>
                        </div>
                    </div>
                </div>

                {/* Submission Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-100 pb-2">Status Pengumpulan</h2>

                        {existingReport ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 p-1.5 rounded-full text-green-600 shrink-0 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-900 text-sm">Laporan Terkirim</h3>
                                            <p className="text-xs text-green-700 mt-1">
                                                Dikirim: {existingReport.submissionDate?.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-green-200/50">
                                        <a
                                            href={existingReport.filePath}
                                            target="_blank"
                                            className="text-sm text-green-700 hover:text-green-900 font-medium flex items-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            Lihat File Saya
                                        </a>
                                    </div>
                                </div>

                                {existingReport.grade ? (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Hasil Penilaian</h3>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-2xl font-bold text-blue-700">{existingReport.grade}</span>
                                            <span className="text-xs text-blue-600">/ 100</span>
                                        </div>
                                        {existingReport.feedback && (
                                            <p className="text-sm text-blue-800 italic">"{existingReport.feedback}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        Menunggu penilaian dosen
                                    </div>
                                )}
                            </div>
                        ) : isOpen ? (
                            <form action={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Link File Laporan (PDF)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            name="filePath"
                                            required
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Upload file Anda ke cloud storage (Google Drive, dll) dan pastikan link dapat diakses publik/dosen.
                                    </p>
                                </div>
                                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    Kirim Laporan
                                </button>
                            </form>
                        ) : (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center text-center">
                                <div className="p-2 bg-red-100 rounded-full text-red-600 mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-red-800 font-semibold text-sm">Sesi Ditutup</h3>
                                <p className="text-red-600 text-xs mt-1">Maaf, batas waktu pengumpulan laporan telah berakhir.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

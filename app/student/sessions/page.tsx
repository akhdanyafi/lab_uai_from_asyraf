import { getStudentSessions } from '@/lib/actions/academic';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function StudentSessionsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const sessions = await getStudentSessions(session.user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Praktikum Saya</h1>
            <p className="text-gray-600">Daftar sesi praktikum aktif dari kelas yang Anda ikuti.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((sess) => {
                    const now = new Date();
                    const isOpen = now >= sess.startDate && now <= sess.deadline;
                    const isSubmitted = sess.reports.length > 0;

                    return (
                        <Link
                            key={sess.id}
                            href={`/student/sessions/${sess.id}`}
                            className={`block bg-white p-6 rounded-lg shadow-sm border transition-colors ${isOpen ? 'border-blue-200 hover:border-blue-500' : 'border-gray-200 opacity-75'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{sess.module.title}</h3>
                                    <p className="text-sm text-gray-500">{sess.class.name}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {isOpen ? 'Aktif' : 'Tutup'}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Deadline:</span>
                                    <span className="font-medium">{sess.deadline.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className={`font-medium ${isSubmitted ? 'text-green-600' : 'text-orange-600'}`}>
                                        {isSubmitted ? 'Sudah Kumpul' : 'Belum Kumpul'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {sessions.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                        Belum ada sesi praktikum aktif.
                    </div>
                )}
            </div>
        </div>
    );
}

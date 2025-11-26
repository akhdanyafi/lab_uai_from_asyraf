import { getLecturerClasses } from '@/lib/actions/academic';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LecturerSessionsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const classes = await getLecturerClasses(session.user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Sesi Praktikum</h1>
            <p className="text-gray-600">Pilih kelas untuk mengelola sesi praktikum.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <Link
                        key={cls.id}
                        href={`/lecturer/sessions/${cls.id}`}
                        className="block bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-500 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                                <p className="text-sm text-gray-500">{cls.course.name}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {cls.semester}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            Klik untuk kelola sesi
                        </div>
                    </Link>
                ))}
                {classes.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                        Anda belum memiliki kelas yang diampu.
                    </div>
                )}
            </div>
        </div>
    );
}

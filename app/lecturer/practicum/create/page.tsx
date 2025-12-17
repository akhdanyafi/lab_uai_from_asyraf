import { getLecturerClasses } from '@/lib/actions/academic';
import { getModules } from '@/lib/actions/practicum';
import { getSession } from '@/lib/auth';
import SessionForm from '@/components/practicum/SessionForm';
import { redirect } from 'next/navigation';

export default async function CreateSessionPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'Dosen') redirect('/login');

    const [classes, modules] = await Promise.all([
        getLecturerClasses(session.user.id),
        getModules()
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Buat Sesi Praktikum Baru</h1>
            <SessionForm classes={classes} modules={modules} redirectTo="/lecturer/practicum" />
        </div>
    );
}

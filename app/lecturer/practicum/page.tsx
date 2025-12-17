import { getLecturerClasses } from '@/lib/actions/academic';
import { getSession } from '@/lib/auth';
import ClassDashboard from '@/components/practicum/views/ClassDashboard';
import { redirect } from 'next/navigation';

export default async function LecturerPracticumPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'Dosen') redirect('/login');

    const classes = await getLecturerClasses(session.user.id);

    return (
        <div className="container mx-auto py-8">
            <ClassDashboard classes={classes} basePath="/lecturer/practicum" />
        </div>
    );
}

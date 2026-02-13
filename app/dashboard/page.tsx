import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // Redirect to role-specific dashboard
    if (session.user.role === 'Admin') {
        redirect('/admin/dashboard');
    } else if (session.user.role === 'Mahasiswa') {
        redirect('/student/dashboard');
    } else if (['Dosen', 'Kaprodi', 'Kepala Laboratorium'].includes(session.user.role)) {
        redirect('/lecturer/dashboard');
    }

    return null;
}

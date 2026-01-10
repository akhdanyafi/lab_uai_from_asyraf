import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.user.role !== 'Mahasiswa') {
        redirect('/login');
    }

    const menuItems = [
        { name: 'Dashboard', href: '/student/dashboard', iconName: 'LayoutDashboard' },
        { name: 'Pinjam Alat', href: '/student/items', iconName: 'Box' },
        { name: 'Peminjaman Saya', href: '/student/loans', iconName: 'ClipboardList' },
        { name: 'Booking Ruangan', href: '/student/rooms', iconName: 'CalendarDays' },
        { name: 'Modul Praktikum', href: '/student/practicum', iconName: 'BookOpen' },
        { name: 'Publikasi', href: '/student/publications', iconName: 'FileText' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                subtitle="Student Portal"
                menuItems={menuItems}
                profileHref="/student/profile"
                user={{
                    fullName: session.user.fullName,
                    secondaryText: session.user.identifier,
                    initial: session.user.fullName.charAt(0)
                }}
            />

            {/* Main Content - responsive margin */}
            <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8">
                {children}
            </main>
        </div>
    );
}

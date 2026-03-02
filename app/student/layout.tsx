import { getSession, hasPermission } from '@/lib/auth';
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

    // Default student menus
    const menuItems: any[] = [
        { name: 'Dashboard', href: '/student/dashboard', iconName: 'LayoutDashboard' },
        { name: 'Peminjaman Alat', href: '/student/items', iconName: 'Box' },
        { name: 'Booking Ruangan', href: '/student/rooms', iconName: 'CalendarDays' },
        {
            name: 'Akademik', href: '#', iconName: 'GraduationCap',
            children: [
                { name: 'Mata Kuliah', href: '/student/courses', iconName: 'GraduationCap' },
                { name: 'Modul Praktikum', href: '/student/practicum', iconName: 'BookOpen' },
            ]
        },
        { name: 'Publikasi', href: '/student/publications', iconName: 'FileText' },
    ];

    // Add extra menu items if student has custom permissions
    if (hasPermission(session, 'publications.manage')) {
        menuItems.push({ name: 'Kelola Publikasi', href: '/lecturer/publications', iconName: 'BookOpen' });
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
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
            <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8">
                {children}
            </main>
        </div>
    );
}

import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function LecturerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || !hasPermission(session, 'dashboard.lecturer')) {
        redirect('/login');
    }

    // Define all possible menu items with their required permissions
    const allMenuItems = [
        { name: 'Dashboard', href: '/lecturer/dashboard', iconName: 'LayoutDashboard', permission: 'dashboard.lecturer' },
        { name: 'Peminjaman Alat', href: '/lecturer/items', iconName: 'Package', permission: 'dashboard.lecturer' },
        { name: 'Booking Ruangan', href: '/lecturer/rooms', iconName: 'CalendarDays', permission: 'dashboard.lecturer' },
        {
            name: 'Akademik', href: '#', iconName: 'GraduationCap',
            permission: 'dashboard.lecturer',
            children: [
                { name: 'Mata Kuliah', href: '/lecturer/courses', iconName: 'Book' },
                { name: 'Modul Praktikum', href: '/lecturer/modules', iconName: 'FileText' },
                { name: 'Jadwal Praktikum', href: '/lecturer/schedules', iconName: 'Calendar' },
            ]
        },
        { name: 'Publikasi', href: '/lecturer/publications', iconName: 'BookOpen', permission: 'dashboard.lecturer' },
    ];

    // Filter: only show items the user has permission for
    const menuItems = allMenuItems.filter(item =>
        hasPermission(session, item.permission)
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                subtitle="Lecturer Portal"
                menuItems={menuItems}
                profileHref="/lecturer/profile"
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

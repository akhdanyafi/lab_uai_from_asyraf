import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function LecturerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.user.role !== 'Dosen') {
        redirect('/login');
    }

    const menuItems = [
        { name: 'Dashboard', href: '/lecturer/dashboard', iconName: 'LayoutDashboard' },
        { name: 'Booking Ruangan', href: '/lecturer/rooms', iconName: 'CalendarDays' },
        { name: 'Praktikum', href: '/lecturer/practicum', iconName: 'FileText' },
        { name: 'Publikasi', href: '/lecturer/publications', iconName: 'BookOpen' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
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

            {/* Main Content - responsive margin */}
            <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8">
                {children}
            </main>
        </div>
    );
}

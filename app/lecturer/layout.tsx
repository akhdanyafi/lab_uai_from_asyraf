import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    FileText,
    BookOpen,
    LogOut
} from 'lucide-react';
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
        { name: 'Dashboard', href: '/lecturer/dashboard', icon: LayoutDashboard },
        { name: 'Booking Ruangan', href: '/lecturer/rooms', icon: CalendarDays },
        { name: 'Praktikum', href: '/lecturer/practicum', icon: FileText },
        { name: 'Publikasi', href: '/lecturer/publications', icon: BookOpen },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
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

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

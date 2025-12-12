import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    FileText,
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
        { name: 'Sesi Praktikum', href: '/lecturer/sessions', icon: FileText },
        { name: 'Akademik', href: '/lecturer/academic', icon: FileText },
        { name: 'Laporan Mahasiswa', href: '/lecturer/reports', icon: FileText },
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

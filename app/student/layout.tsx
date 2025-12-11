import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    ClipboardList,
    CalendarDays,
    FileText,
    LogOut
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';

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
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Pinjam Alat', href: '/student/items', icon: Box },
        { name: 'Peminjaman Saya', href: '/student/loans', icon: ClipboardList },
        { name: 'Booking Ruangan', href: '/student/rooms', icon: CalendarDays },
        { name: 'Praktikum', href: '/student/sessions', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            {/* Sidebar */}
            <Sidebar
                subtitle="Student Portal"
                menuItems={menuItems}
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

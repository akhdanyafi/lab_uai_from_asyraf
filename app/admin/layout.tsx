import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    ClipboardList,
    FileText,
    LogOut,
    CalendarDays,
    Image as ImageIcon
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.user.role !== 'Admin') {
        redirect('/login');
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Validasi', href: '/admin/validations', icon: ClipboardList },
        { name: 'Manajemen Aset', href: '/admin/inventory', icon: Box },
        {
            name: 'Manajemen Akademik',
            href: '#',
            icon: FileText,
            children: [
                { name: 'Publikasi', href: '/admin/publications', icon: FileText },
                { name: 'Mata Kuliah', href: '/admin/courses', icon: FileText },
                { name: 'Kelas', href: '/admin/classes', icon: FileText },
                { name: 'Bank Modul', href: '/admin/modules', icon: FileText },
                { name: 'Manajemen Praktikum', href: '/admin/practicum', icon: FileText },
            ]
        },
        { name: 'Tata Kelola', href: '/admin/governance', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                subtitle="Admin Panel"
                menuItems={menuItems}
                user={{
                    fullName: session.user.fullName,
                    secondaryText: session.user.email,
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

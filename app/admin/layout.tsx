import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

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
        { name: 'Dashboard', href: '/admin/dashboard', iconName: 'LayoutDashboard' },
        { name: 'Validasi', href: '/admin/validations', iconName: 'ClipboardList' },
        { name: 'Manajemen Aset', href: '/admin/inventory', iconName: 'Box' },
        { name: 'Praktikum', href: '/admin/practicum', iconName: 'ClipboardList' },
        { name: 'Jurnal Publikasi', href: '/admin/publications', iconName: 'BookOpen' },
        { name: 'Tata Kelola', href: '/admin/governance', iconName: 'FileText' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                subtitle="Admin Panel"
                menuItems={menuItems}
                profileHref="/admin/profile"
                user={{
                    fullName: session.user.fullName,
                    secondaryText: session.user.email,
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

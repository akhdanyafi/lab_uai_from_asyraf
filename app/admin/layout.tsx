import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/lib/actions';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    Tags,
    MapPin,
    FileText,
    LogOut,
    CalendarDays
} from 'lucide-react';

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
        { name: 'Peminjaman', href: '/admin/loans', icon: CalendarDays },
        { name: 'Alat', href: '/admin/items', icon: Box },
        { name: 'Kategori', href: '/admin/categories', icon: Tags },
        { name: 'Ruangan', href: '/admin/rooms', icon: MapPin },
        { name: 'Dokumen', href: '/admin/documents', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-primary">Lab Informatika</h1>
                    <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {session.user.fullName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{session.user.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    </div>

                    <form action={async () => {
                        'use server';
                        await logout();
                        redirect('/login');
                    }}>
                        <button className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-[#EF4444] hover:bg-red-50 hover:border-red-100 border border-transparent rounded-lg transition-all text-sm font-medium group"
        >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Keluar
        </button>
    );
}
